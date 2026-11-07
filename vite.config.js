import {defineConfig, loadEnv} from 'vite';
import {placesMiddleware} from './server/places.mjs';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'SERPAPI_');
  return {
    plugins: [{
      name: 'aidear-venue-api',
      configureServer(server) { server.middlewares.use(placesMiddleware(() => process.env.SERPAPI_API_KEY || env.SERPAPI_API_KEY)); },
      configurePreviewServer(server) { server.middlewares.use(placesMiddleware(() => process.env.SERPAPI_API_KEY || env.SERPAPI_API_KEY)); },
    }],
  };
});
