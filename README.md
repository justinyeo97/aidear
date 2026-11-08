# 爱dear — a little invitation

A personal date invitation for Mia. The public activity-planning app has been replaced with a simple invitation, reply form, and private owner desk.

## Flow

1. Open the private owner access link or enter `INVITE_ADMIN_KEY` at `/?owner=1`.
2. Create an invitation with names and a personal note, then copy the generated link and send it yourself.
3. The recipient opens the invitation, accepts or suggests another day, and chooses a date, time and dinner cuisine. Declining is also supported.
4. The owner desk refreshes every 15 seconds while visible and shows an unread-reply banner and tab-title count. This is an in-app notification, not email or a background push notification.

All dates and times use Asia/Kuala_Lumpur (MYT, GMT+8). Each invitation offers the next three Friday/Saturday/Sunday dates and accepts a different future date, custom time, and an optional note.

## Run

Use Node 20 or newer. Install with `npm.cmd install`, start with `npm.cmd run dev`, build with `npm.cmd run build`, and preview with `npm.cmd run preview`. Live Server cannot run the backend.

Private server configuration in Git-ignored `.env.local`:

```text
INVITE_ADMIN_KEY=<strong-random-owner-access-code>
BLOB_STORE_ID=<connected-private-vercel-blob-store>
```

Local Blob access also needs a development OIDC session or a `BLOB_READ_WRITE_TOKEN`. Production uses the project's connected private Blob store and Vercel OIDC. Set the owner key as a sensitive production environment variable; never prefix it with `VITE_`.

The private owner link contains the key in the URL fragment. The app exchanges it for an HttpOnly, SameSite=Strict session cookie and removes the fragment. Keep the owner link private; send only the generated invitation link to the recipient. Anyone holding a recipient invitation link may view and answer that invitation. Reply details are available only to the authenticated owner. Responses use conditional writes to avoid silently overwriting another reply, and repeat submissions are idempotent.

Invitations and replies persist in private Vercel Blob JSON documents. Owner sessions last seven days. Revoking an invitation deletes its stored reply and invalidates its link. Browser-local favourites from the retired planner are not used or uploaded.

Run backend and gesture checks with `node --test server/invitation.test.mjs src/headScratch.test.js`.
