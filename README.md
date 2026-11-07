# 爱dear (aidear)

爱 (ài) means love in Chinese; paired with dear, aidear sounds like idea.

A React + Vite date planner with a cat concierge, in-app venue discovery through SerpApi, budget and specific activity filters, detailed date plans, and browser-local saved favourites.

## Run locally

```sh
npm.cmd install
npm.cmd run dev
```

Build with `npm.cmd run build`. Preview the production build with `npm.cmd run preview`.

Open the URL printed by Vite (usually http://127.0.0.1:5173). You can also use **Terminal → Run Task → Start aidear** in VS Code.

### VS Code Live Server

Go Live can show the compiled layout, but cannot run venue searches. Use `npm.cmd run dev` or `npm.cmd run preview` for the complete app, including its private server-side search endpoint.

Enter a city or neighbourhood and budget, then submit Find my date. Choose or change the activity type directly above the resulting date ideas; suggestions update immediately without resubmitting the planner. Find nearby automatically searches the chosen area without a second form. Change preferences returns to the original planner. Each card and detailed plan has a Find nearby button that loads venue cards inside aidear. Heart a venue to save it under Saved plans → Favourite places. Place favourites use the `aidear-saved-places` localStorage key; date ideas use `aidear-saved`.

## Private search configuration

Create `.env.local` with `SERPAPI_API_KEY=your_key_here`, then restart Vite. The file is ignored by Git. Never prefix this key with `VITE_` or put it in React code. The `/api/places` endpoint calls SerpApi server-side, normalizes the response, caches successful requests for ten minutes, and limits uncached searches per client. No API key is sent to the browser.

Vite's dev and preview servers both run the endpoint locally. Static hosting alone cannot run this backend; production hosting must provide a server-side endpoint and set the key as a server secret. Review authentication and shared rate limits before exposing the endpoint publicly. SerpApi searches consume account credits. Location queries are sent to SerpApi; no geolocation permissions are requested.

Favourites are saved in localStorage. Images load from Unsplash; fonts from Google Fonts. Prices are illustrative planning estimates in MYR, not venue prices. Personal notes only last while the current plan is open.
