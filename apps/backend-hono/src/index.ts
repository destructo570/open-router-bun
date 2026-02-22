import { Hono } from 'hono';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { AppError } from './errors/app-error';
import auth from './features/auth/auth.route';

const db = drizzle(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET!;


const app = new Hono()
app.route('/auth', auth);

app.get('/health', (c) => {
  return c.text('Health check: All systems online!')
})

app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ err: err.message }, err.statusCode);
  }

  return c.json({ error: "Internal Server Error" }, 500);
})

export default {
  port: 3001,
  fetch: app.fetch,
} 
