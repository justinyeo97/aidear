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

## Build a date itinerary

Use **Add to my date** on an activity card to start an itinerary. Use the same action on a nearby venue to attach it to that activity's unassigned stop. Add dinner and dessert the same way, then open **My date** in the navigation.

The builder supports a title, area, optional date, start times, editable estimated costs for two, personal notes, reordering and removing stops. It totals the estimates and flags when the whole outing exceeds the selected budget. Totals exclude transport and are not venue quotes.

Draft changes are kept in this browser automatically. **Save this date** creates a named itinerary; saved itineraries can be reopened, updated or deleted from **My date**. Data uses the `aidear-itineraries` localStorage key and does not sync across devices. Storage errors are displayed in the builder.

## Private search configuration

Create `.env.local` with `SERPAPI_API_KEY=your_key_here`, then restart Vite. The file is ignored by Git. Never prefix this key with `VITE_` or put it in React code. The `/api/places` endpoint calls SerpApi server-side, normalizes the response, caches successful requests for ten minutes, and limits uncached searches per client. No API key is sent to the browser.

Vite's dev and preview servers both run the endpoint locally. Vercel uses `api/places.js` to run the same handler as a serverless function. Set `SERPAPI_API_KEY` as a sensitive production environment variable in Vercel before deploying. `vercel.json` configures the Vite build and function timeout; private environment files are excluded from Git and direct deployment uploads. Caches and rate limits are per running instance, not globally shared. SerpApi searches consume account credits. Location queries are sent to SerpApi; no geolocation permissions are requested.

Favourites are saved in localStorage. Images load from Unsplash; fonts from Google Fonts. Prices are illustrative planning estimates in MYR, not venue prices. Personal notes only last while the current plan is open.
