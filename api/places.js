import {placesMiddleware} from '../server/places.mjs';

const handlePlaces = placesMiddleware(() => process.env.SERPAPI_API_KEY);

export default function handler(req, res) {
  return handlePlaces(req, res, () => {
    res.writeHead(404, {'Content-Type':'application/json'});
    res.end(JSON.stringify({error:'Search endpoint not found.'}));
  });
}
