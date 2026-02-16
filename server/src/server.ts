// server/src/server.ts

import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import { ENV } from './env'
import { runQuery } from './databricks'

process.on('unhandledRejection', (e) => {
  console.error('[UNHANDLED REJECTION]', e)
  process.exit(1)
})
process.on('uncaughtException', (e) => {
  console.error('[UNCAUGHT EXCEPTION]', e)
  process.exit(1)
})

console.log('[BOOT] ENV:', {
  PORT: ENV.PORT,
  HAS_DATABRICKS_HOST: !!process.env.DATABRICKS_HOST,
  HAS_DATABRICKS_HTTP_PATH: !!process.env.DATABRICKS_HTTP_PATH,
  HAS_DATABRICKS_TOKEN: !!process.env.DATABRICKS_TOKEN,
})

const app = express()
app.use(cors())
app.use(express.json())

// ---- API routes ----
app.get('/api/health', (_req: Request, res: Response) => res.json({ ok: true }))

app.get('/api/employees', async (_req: Request, res: Response) => {
  try {
    const rows = await runQuery('SELECT * FROM workspace.demo_db.employees LIMIT 100')
    res.json({ rows })
  } catch (e: any) {
    console.error('[EMPLOYEES ERROR]', e?.message || e)
    res.status(500).json({ error: e?.message || 'Internal Server Error' })
  }
})

app.post('/api/query', async (req: Request, res: Response) => {
  try {
    const { sql } = (req.body || {}) as { sql?: string }
    if (!sql) return res.status(400).json({ error: 'Missing sql' })

    console.log('[SQL]', sql)
    const rows = await runQuery(sql)
    res.json({ rows })
  } catch (e: any) {
    console.error('[QUERY ERROR]', e?.message || e)
    res.status(500).json({ error: e?.message || 'Internal Server Error' })
  }
})

// ---- Serve React build (server/public) ----
const publicDir = path.join(process.cwd(), 'public')
app.use(express.static(publicDir))

// For React Router (SPA) - send index.html for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' })
  res.sendFile(path.join(publicDir, 'index.html'))
})

const server = app.listen(ENV.PORT, () => {
  console.log(`✅ Server running on port ${ENV.PORT}`)
})

server.on('error', (err) => {
  console.error('[SERVER LISTEN ERROR]', err)
  process.exit(1)
})
