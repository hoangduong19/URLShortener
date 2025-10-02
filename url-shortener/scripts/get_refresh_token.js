#!/usr/bin/env node
// scripts/get_refresh_token.js
// Usage: node scripts/get_refresh_token.js
// This script starts a temporary local server and guides you to authorize the app
// It will write a `.env` file with SMTP_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN

import http from 'http'
import open from 'open'
import fs from 'fs'
import { google } from 'googleapis'
import readline from 'readline'

function ask(question){
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans) }))
}

async function main(){
  console.log('\n=== Gmail OAuth2 Refresh Token Helper ===\n')
  const clientId = (await ask('Google Client ID: ')).trim()
  const clientSecret = (await ask('Google Client Secret: ')).trim()
  const smtpUser = (await ask('Email address to send from (SMTP_USER): ')).trim()

  if(!clientId || !clientSecret || !smtpUser){
    console.error('All fields are required. Exiting.')
    process.exit(1)
  }

  const port = 3001
  const redirectUri = `http://localhost:${port}/oauth2callback`
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  // Use the broader mail scope so the refresh token can be used for SMTP XOAUTH2
  // This gives full mail access (send via SMTP) which nodemailer expects when using OAuth2.
  const scopes = ['https://mail.google.com/']
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes, prompt: 'consent' })

  console.log('\nA browser window will open to let you authorize the Gmail send permission.')
  console.log('If it does not open automatically, paste this URL into your browser:\n')
  console.log(authUrl + '\n')

  try { await open(authUrl) } catch (e) { /* ignore */ }

  const server = http.createServer(async (req, res) => {
    if (!req.url) return
    if (req.url.startsWith('/oauth2callback')){
      const urlObj = new URL(req.url, `http://localhost:${port}`)
      const code = urlObj.searchParams.get('code')
      if (!code){
        res.writeHead(400, {'Content-Type':'text/plain'})
        res.end('No code received')
        return
      }

      res.writeHead(200, {'Content-Type':'text/html'})
      res.end('<h2>Authorization received — you can close this window and return to the terminal.</h2>')

      server.close()

      try{
        const { tokens } = await oAuth2Client.getToken(code)
        // tokens should include refresh_token when prompt=consent
        if (!tokens.refresh_token){
          console.error('\nNo refresh token was returned. Make sure you used a Google account and allowed offline access.\n')
          console.error('Tokens returned:', tokens)
          process.exit(1)
        }
        const refreshToken = tokens.refresh_token
        const env = `SMTP_USER=${smtpUser}\nGOOGLE_CLIENT_ID=${clientId}\nGOOGLE_CLIENT_SECRET=${clientSecret}\nGOOGLE_REFRESH_TOKEN=${refreshToken}\n`;
        fs.writeFileSync('.env', env)
        console.log('\n.Written .env file with your credentials. Keep it secret and do not commit to git.')
        console.log('.env content:\n')
        console.log(env)
        process.exit(0)
      }catch(err){
        console.error('Failed to exchange code for tokens:', err)
        process.exit(1)
      }
    } else {
      res.writeHead(404)
      res.end('Not found')
    }
  })

  server.listen(port, () => console.log(`\nListening on http://localhost:${port} to receive the OAuth callback...`))
}

main().catch(err => { console.error(err); process.exit(1) })
