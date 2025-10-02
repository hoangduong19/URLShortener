// server.js - clean implementation with email verification
import express from 'express'
import { nanoid } from 'nanoid'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const PORT = process.env.PORT || 3000
// Base public URL used when generating full short links. Set this in production (e.g. https://yourdomain.com)
const BASE_URL = process.env.BASE_URL 
// Optional short branded domain to display in the UI (example: my.ly or d.gg). Do not include protocol.
const DISPLAY_DOMAIN = process.env.DISPLAY_DOMAIN || ''

app.use(express.json())
app.use(express.static(path.join(__dirname)))
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI 
mongoose.connect(MONGODB_URI)
  .then(()=> console.log('✅ Kết nối MongoDB thành công!', MONGODB_URI))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err))

const urlSchema = new mongoose.Schema({ shortId: { type: String, required: true, unique: true }, originalUrl: { type: String, required: true }, createdAt: { type: Date, default: Date.now } })
const Url = mongoose.model('Url', urlSchema)

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
})
const User = mongoose.model('User', userSchema)

async function createTransporter(){
  // If Google OAuth2 credentials are provided, use Gmail OAuth2
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, SMTP_USER } = process.env
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN && SMTP_USER) {
    try {
      const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
      oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
      const accessTokenObj = await oAuth2Client.getAccessToken()
      const accessToken = accessTokenObj?.token || accessTokenObj
      if (!accessToken) throw new Error('Failed to obtain access token')
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: SMTP_USER,
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          refreshToken: GOOGLE_REFRESH_TOKEN,
          accessToken,
        },
      })
    } catch (err) {
      console.error('Gmail OAuth2 setup failed, falling back to SMTP/Ethereal:', err)
    }
  }

  // Fall back to SMTP if SMTP_HOST is provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER) return nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT||587), secure: !!process.env.SMTP_SECURE, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  // Development fallback: Ethereal
  const acct = await nodemailer.createTestAccount()
  return nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, auth: { user: acct.user, pass: acct.pass } })
}

async function sendVerificationEmail(to, code){
  try{
    const transporter = await createTransporter()
    const info = await transporter.sendMail({ from: 'no-reply@tinyurl.local',
       to, subject: 'Verification code',
        text: `Your code: ${code}`,
         html: `<p>Your verification code: <strong>${code}</strong></p>` })
    const preview = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null
    if (preview) console.log('Preview email:', preview)
    return { ok:true }
  }catch(err){ console.error('Mailer error', err); return { ok:false, error: err.message } }
}

app.post('/shorten', async (req,res)=>{
  try{
    const { originalUrl, customId } = req.body
    if (!originalUrl) return res.status(400).json({ error: 'Thiếu originalURL' })
    let shortId = customId || nanoid(6)
    if (customId){ const e = await Url.findOne({ shortId: customId }); if (e) return res.status(400).json({ error: 'Trùng customId' }) }
  await new Url({ shortId, originalUrl }).save()
  const shortUrl = `${BASE_URL}/${shortId}`
  const shortPath = `${shortId}`
  const displayUrl = DISPLAY_DOMAIN ? `${DISPLAY_DOMAIN.replace(/\/$/, '')}/${shortId}` : undefined
  return res.json({ shortUrl, shortPath, displayUrl })
  }catch(err){ return res.status(500).json({ error: 'Lỗi server', details: err.message }) }
})

app.post('/register', async (req,res)=>{
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Thiếu thông tin đăng ký' })
  try{
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email đã được sử dụng' })
    const passwordHash = await bcrypt.hash(password, 10)
    const code = Math.floor(100000 + Math.random()*900000).toString()
    const expires = new Date(Date.now() + 15*60*1000)
    await new User({ name, email, passwordHash, verificationCode: code, verificationExpires: expires, emailVerified:false }).save()
    const mailRes = await sendVerificationEmail(email, code)
    if (!mailRes.ok) return res.status(201).json({ message: 'Đăng ký thành công, nhưng không gửi được email xác thực' })
    return res.status(201).json({ message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực.' })
  }catch(err){ return res.status(500).json({ error: 'Lỗi server', details: err.message }) }
})

app.post('/verify-email', async (req,res)=>{
  const { email, code } = req.body
  if (!email || !code) return res.status(400).json({ error:'Missing email or code' })
  try{
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'User not found' })
    if (user.emailVerified) return res.json({ message: 'Already verified' })
    if (!user.verificationCode || !user.verificationExpires) return res.status(400).json({ error: 'No verification pending' })
    if (new Date() > user.verificationExpires) return res.status(400).json({ error: 'Code expired' })
    if (user.verificationCode !== code) return res.status(400).json({ error: 'Invalid code' })
    user.emailVerified = true; user.verificationCode = undefined; user.verificationExpires = undefined
    await user.save()
    return res.json({ message: 'Email verified' })
  }catch(err){ return res.status(500).json({ error:'Lỗi server', details: err.message }) }
})

app.post('/resend-verification', async (req,res)=>{
  const { email } = req.body
  if (!email) return res.status(400).json({ error:'Missing email' })
  try{
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error:'User not found' })
    if (user.emailVerified) return res.status(400).json({ error:'Already verified' })
    const code = Math.floor(100000 + Math.random()*900000).toString()
    const expires = new Date(Date.now() + 15*60*1000)
    user.verificationCode = code; user.verificationExpires = expires; await user.save()
    const mailRes = await sendVerificationEmail(email, code)
    if (!mailRes.ok) return res.status(500).json({ error:'Failed to send email' })
    return res.json({ message: 'Verification email resent' })
  }catch(err){ return res.status(500).json({ error:'Lỗi server', details: err.message }) }
})

app.post('/login', async (req,res)=>{
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Thiếu thông tin đăng nhập' })
  try{
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error:'Email hoặc mật khẩu không đúng' })
    if (!user.emailVerified) return res.status(400).json({ error:'Email chưa được xác thực. Vui lòng kiểm tra email.' })
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(400).json({ error:'Email hoặc mật khẩu không đúng' })
    return res.json({ message: 'Đăng nhập thành công' })
  }catch(err){ return res.status(500).json({ error:'Lỗi server', details: err.message }) }
})

app.get('/:shortId', async (req,res)=>{
  try{
    const requestPath = req.path
    const ext = path.extname(requestPath)
    if (ext){ const fileOnDisk = path.join(__dirname, requestPath); const normalized = path.normalize(fileOnDisk); if (!normalized.startsWith(__dirname)) return res.status(400).send('Bad request'); if (fs.existsSync(normalized)) return res.sendFile(normalized); return res.status(404).send('Không tìm thấy link này!') }
    const { shortId } = req.params
    const urlDoc = await Url.findOne({ shortId })
    if (urlDoc) return res.redirect(urlDoc.originalUrl)
    return res.status(404).send('Không tìm thấy link này!')
  }catch(err){ return res.status(500).json({ error:'Lỗi server', details: err.message }) }
})

app.get('/', (req,res)=> res.sendFile(path.join(__dirname, 'index.html')))

app.listen(PORT, ()=> console.log('Server đang chạy tại ' + BASE_URL))