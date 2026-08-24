// src/utils/mailer.js
// Sends a real email via your own Gmail account using SMTP — no third-party service,
// no frontend involvement. Requires a Gmail "App Password" (NOT your normal Gmail
// password — Gmail blocks plain-password SMTP login for security).
//
// Setup (5 minutes, one-time):
//   1. Turn on 2-Step Verification on rohitguptaom45@gmail.com:
//      https://myaccount.google.com/security
//   2. Create an App Password: https://myaccount.google.com/apppasswords
//      → App: "Mail", Device: "Other (CodeArena backend)" → copy the 16-character code
//   3. Add these two lines to your backend's .env file:
//        GMAIL_USER=rohitguptaom45@gmail.com
//        GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx     (the 16-char code, no spaces)
//   4. npm install nodemailer

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const ADMIN_EMAIL = process.env.GMAIL_USER || 'rohitguptaom45@gmail.com'

// Fire-and-forget — a failed notification email should never fail the signup request.
export async function sendNewSignupEmail(user) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('[mailer] GMAIL_USER / GMAIL_APP_PASSWORD not set — skipping signup email.')
    return
  }
  try {
    await transporter.sendMail({
      from: `"CodeArena" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🎉 New CodeArena signup: @${user.username}`,
      text: `A new user just joined CodeArena.\n\nUsername: ${user.username}\nFull name: ${user.fullName || '-'}\nEmail: ${user.email || '-'}\nJoined: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2>🎉 New CodeArena signup</h2>
          <table style="border-collapse: collapse;">
            <tr><td style="padding:4px 12px 4px 0; color:#666;">Username</td><td><strong>@${user.username}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0; color:#666;">Full name</td><td>${user.fullName || '-'}</td></tr>
            <tr><td style="padding:4px 12px 4px 0; color:#666;">Email</td><td>${user.email || '-'}</td></tr>
            <tr><td style="padding:4px 12px 4px 0; color:#666;">Joined</td><td>${new Date().toLocaleString()}</td></tr>
          </table>
        </div>
      `,
    })
    console.log(`[mailer] Sent new-signup email for @${user.username}`)
  } catch (err) {
    console.error('[mailer] Failed to send new-signup email:', err.message)
  }
}