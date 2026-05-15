import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  )
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.use(errorHandler)

  return app
}
