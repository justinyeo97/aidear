import {activities} from '../src/activities.js';
const queries = {
  ...Object.fromEntries(activities.map(idea=>[idea.id,idea.query])),
  coffee: 'quiet cafes for a coffee date',
  park: 'parks with picnic spots and walking trails',
  art: 'art galleries and museums',
  books: 'bookstores with cafes',
};
const cache = new Map();
const pending = new Map();
const requests = new Map();
function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null; } catch { return null; }
}
export function normalizePlaces(data) {
  return (Array.isArray(data.local_results) ? data.local_results : []).filter(p => typeof p.title === 'string').slice(0, 12).map(p => ({
    id: String(p.place_id || p.data_id || `${p.title}:${p.address || ''}`),
    name: p.title,
    address: typeof p.address === 'string' ? p.address : '',
    rating: typeof p.rating === 'number' ? p.rating : null,
    reviews: typeof p.reviews === 'number' ? p.reviews : null,
    price: typeof p.price === 'string' ? p.price : '',
    hours: typeof p.hours === 'string' ? p.hours : '',
    image: safeUrl(p.thumbnail),
    mapsUrl: 'https://www.google.com/maps/search/?' + new URLSearchParams({api: '1', query: [p.title, p.address].filter(Boolean).join(' ')}),
  }));
}
export function placesMiddleware(getKey, fetcher = fetch) {
  return async (req, res, next) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname !== '/api/places') return next();
    const send = (status, body) => { res.writeHead(status, {'Content-Type': 'application/json', 'Cache-Control': 'no-store'}); res.end(JSON.stringify(body)); };
    if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return send(405, {error: 'Use GET for venue searches.'}); }
    const idea = url.searchParams.get('idea');
    const location = (url.searchParams.get('location') || '').trim();
    if (!queries[idea] || !Object.hasOwn(queries, idea) || !location || location.length > 150) return send(400, {error: 'Enter a city or neighbourhood before searching for places.'});
    const apiKey = getKey();
    if (!apiKey) return send(503, {error: 'Venue search is not configured. Set SERPAPI_API_KEY on the server and restart it.'});
    const key = `${idea}:${location.toLowerCase()}`;
    const cached = cache.get(key);
    if (cached && cached.expires > Date.now()) return send(200, cached.data);
    const client = (process.env.VERCEL && req.headers?.['x-vercel-forwarded-for']) || req.socket?.remoteAddress || 'local';
    const rate = requests.get(client);
    const window = rate && rate.expires > Date.now() ? rate : {count: 0, expires: Date.now() + 60000};
    if (window.count >= 10) return send(429, {error: 'Please wait a minute before searching for more places.'});
    window.count++; requests.set(client, window);
    if (requests.size > 1000) for (const [id, value] of requests) if (value.expires < Date.now()) requests.delete(id);
    try {
      if (!pending.has(key)) {
        const promise = (async () => {
          const params = new URLSearchParams({engine: 'google_local', q: `${queries[idea]} in ${location}`, location, hl: 'en', api_key: apiKey});
          // Leave headroom below the function's 60-second limit for a JSON response.
          const response = await fetcher(`https://serpapi.com/search.json?${params}`, {signal: AbortSignal.timeout(50000)});
          if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Venue search authentication failed. Check the server API key.' : response.status === 429 ? 'The venue search quota is unavailable. Try again later.' : 'The venue search service is unavailable. Try again shortly.');
          const raw = await response.json();
          if (raw.error) throw new Error('The provider could not complete this search. Check the location and your SerpApi account quota.');
          if (!Array.isArray(raw.local_results)) throw new Error('No venue results were returned. Try a broader city or a different area.');
          const data = {places: normalizePlaces(raw), location, source: 'Google Local via SerpApi'};
          if (cache.size >= 100) cache.delete(cache.keys().next().value);
          cache.set(key, {data, expires: Date.now() + 10 * 60000});
          return data;
        })();
        pending.set(key, promise);
        // Only the originating request owns cleanup; concurrent callers share it.
        promise.then(()=>pending.delete(key),()=>pending.delete(key));
      }
      const data = await pending.get(key);
      return send(200, data);
    } catch (error) {
      return send(error.name === 'TimeoutError' ? 504 : 502, {error: error.name === 'TimeoutError' ? 'The venue provider is taking longer than expected. Please retry this search in a moment.' : error instanceof TypeError || error instanceof SyntaxError ? 'Could not reach the venue search service. Please try again.' : error.message});
    }
  };
}
