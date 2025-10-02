#!/usr/bin/env node
// scripts/send_test_mail.js
// Try sending a test email using current env configuration.

import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

dotenv.config()

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env

async function createTransporter(){
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN && SMTP_USER) {
    console.log('Using Gmail OAuth2 transport')
    const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
    const accessTokenObj = await oAuth2Client.getAccessToken()
    const accessToken = accessTokenObj?.token || accessTokenObj
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SMTP_USER,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken,
      }
    })
  }

  if (SMTP_HOST && SMTP_USER) {
    console.log('Using basic SMTP transport')
    return nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT||587), secure: !!SMTP_SECURE, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  }

  console.log('Using Ethereal dev account')
  const acct = await nodemailer.createTestAccount()
  return nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, auth: { user: acct.user, pass: acct.pass } })
}

async function run(){
  try{
    const transporter = await createTransporter()
    const from = SMTP_USER || 'test@local'
    const to = SMTP_USER || 'test@local'
    console.log('Sending test mail from', from, 'to', to)
    const info = await transporter.sendMail({ from: `Test <${from}>`, to, subject: 'Test email from URLShortener', text: 'This is a test message from your local URLShortener app.' })
    console.log('Send result:', info)
    const preview = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null
    if (preview) console.log('Preview URL (ethereal):', preview)
  }catch(err){
    console.error('Error sending test mail:', err)
    process.exit(1)
  }
}

run()
