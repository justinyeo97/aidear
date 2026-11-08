# 爱dear — a little invitation

A personal date invitation for Mia. The public activity-planning app has been replaced with a simple invitation, reply form, and private owner desk.

## Flow

1. Open the private owner access link or enter `INVITE_ADMIN_KEY` at `/?owner=1`.
2. Create an invitation with names and a personal note, then copy the generated link and send it yourself.
3. The recipient starts with a Yes/No question, then chooses an activity, day and time one screen at a time. Dinner adds a cuisine step; other activities skip it. The opening No button briefly changes to Yes as a visual joke and opens the questions; it never submits a reply. The final review requires explicit confirmation and includes a genuine decline option. The same link is reusable after replying. Upcoming date options refresh each time the link is loaded.
4. New submissions send a Resend email with the activity, date, time, dinner cuisine when applicable, ride preference, and note. New booking details are not stored in the app. After confirmation, ?Book another date? opens a fresh activity selection; the same invitation supports repeated bookings.

All dates and times use Asia/Kuala_Lumpur (MYT, GMT+8). Each invitation offers the next three Friday/Saturday/Sunday dates and accepts a different future date, custom time, and an optional note.

## Run

Use Node 20 or newer. Install with `npm.cmd install`, start with `npm.cmd run dev`, build with `npm.cmd run build`, and preview with `npm.cmd run preview`. Live Server cannot run the backend.

Private server configuration in Git-ignored `.env.local`:

```text
INVITE_ADMIN_KEY=<strong-random-owner-access-code>
BLOB_STORE_ID=<connected-private-vercel-blob-store>
RESEND_API_KEY=<private-resend-api-key>
NOTIFICATION_EMAIL=<owner-email-address>
EMAIL_FROM=aidear <onboarding@resend.dev>
```

Local Blob access also needs a development OIDC session or a `BLOB_READ_WRITE_TOKEN`. Production uses the project's connected private Blob store and Vercel OIDC. Set the owner key as a sensitive production environment variable; never prefix it with `VITE_`.

Set `RESEND_API_KEY` as a sensitive production variable too. Resend's default `onboarding@resend.dev` sender can send only to the email address associated with its account; other recipients require a verified sender domain. Failed email delivery leaves the form selections in the browser for retry. A stable per-submission provider key prevents duplicate emails on retries within Resend's idempotency window. New submissions use new keys. Resend acceptance is not proof of inbox delivery.

The private owner link contains the key in the URL fragment. The app exchanges it for an HttpOnly, SameSite=Strict session cookie and removes the fragment. Keep the owner link private; send only the generated invitation link to the recipient. Anyone holding a recipient invitation link may view and answer that invitation. Reply details are available only to the authenticated owner. New booking submissions are emailed without writing response or history records. Existing historical replies remain available in the owner desk.

Invitation configurations and older replies persist in private Vercel Blob JSON documents. New bookings are email-only. Owner sessions last seven days. Revoking an invitation deletes its stored reply and invalidates its link. Browser-local favourites from the retired planner are not used or uploaded.

Run backend and gesture checks with `node --test server/invitation.test.mjs server/notifications.test.mjs src/headScratch.test.js`.
