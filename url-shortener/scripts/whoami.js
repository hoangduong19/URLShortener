#!/usr/bin/env node
// scripts/whoami.js
// Prints which Gmail account the refresh token corresponds to (via Gmail Profile)

import dotenv from 'dotenv'
import { google } from 'googleapis'

dotenv.config()

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
  console.error('Missing env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN')
  process.exit(1)
}

async function run() {
  try {
    const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
    console.log('Obtaining access token...')
    await oAuth2Client.getAccessToken()
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })
    console.log('Fetching profile...')
    const res = await gmail.users.getProfile({ userId: 'me' })
    console.log('Gmail profile:')
    console.dir(res.data, { depth: null })
  } catch (err) {
    console.error('Error fetching profile:', err)
    process.exit(2)
  }
}

run()
