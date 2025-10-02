#!/usr/bin/env node
// scripts/check_token.js
// Exchange GOOGLE_REFRESH_TOKEN for an access token and print result.

import dotenv from 'dotenv'
import { google } from 'googleapis'

dotenv.config()

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
  console.error('Missing one of required env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN')
  process.exit(1)
}

async function run() {
  try {
    const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
    console.log('Requesting access token using refresh token...')
    const res = await oAuth2Client.getAccessToken()
    console.log('Result from getAccessToken():')
    console.dir(res, { depth: 2 })
    const token = res?.token || res
    if (!token) {
      console.error('\nNo access token returned. The refresh token may be invalid or revoked.')
      process.exit(2)
    }
    console.log('\nAccess token received (trimmed):', String(token).slice(0, 60) + '...')
    console.log('You can now use this access token in a test mail script.')
  } catch (err) {
    console.error('Error while obtaining access token:', err)
    process.exit(3)
  }
}

run()
