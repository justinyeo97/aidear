# 爱dear — a little invitation

A personal date invitation for Mia. The public activity-planning app has been replaced with a simple invitation, reply form, and private owner desk.

## Flow

1. Open the private owner access link or enter `INVITE_ADMIN_KEY` at `/?owner=1`.
2. Create an invitation with names and a personal note, then copy the generated link and send it yourself.
3. The recipient opens the invitation, accepts or suggests another day, and chooses a date, time and dinner cuisine. Declining is also supported.
4. The reply is saved privately first, then a Resend email is sent to the owner with the response, date, time, cuisine and note. The owner desk also refreshes every 15 seconds while visible and shows an unread-reply banner and tab-title count.

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

Set `RESEND_API_KEY` as a sensitive production variable too. Resend's default `onboarding@resend.dev` sender can send only to the email address associated with its account; other recipients require a verified sender domain. Email failure never discards a reply. The private desk shows email acceptance status and provides an owner-only retry within 23 hours, using a stable provider idempotency key. Resend acceptance is not proof of inbox delivery. Automatic retries while the owner page is closed are not implemented; failures remain visible in the private desk.

The private owner link contains the key in the URL fragment. The app exchanges it for an HttpOnly, SameSite=Strict session cookie and removes the fragment. Keep the owner link private; send only the generated invitation link to the recipient. Anyone holding a recipient invitation link may view and answer that invitation. Reply details are available only to the authenticated owner. Responses use conditional writes to avoid silently overwriting another reply, and repeat submissions are idempotent.

Invitations and replies persist in private Vercel Blob JSON documents. Owner sessions last seven days. Revoking an invitation deletes its stored reply and invalidates its link. Browser-local favourites from the retired planner are not used or uploaded.

Run backend and gesture checks with `node --test server/invitation.test.mjs server/notifications.test.mjs src/headScratch.test.js`.
