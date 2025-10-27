import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { version } from '@braves-journal/shared';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ message: 'Braves Journal API', version });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = Number(process.env.PORT) || 3001;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`API server running on http://localhost:${info.port}`);
  }
);
