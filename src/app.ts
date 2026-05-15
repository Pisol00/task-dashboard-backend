import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { metricRouter } from './modules/metrics/metric.routes.js'
import { taskRouter } from './modules/tasks/task.routes.js'
import { userRouter } from './modules/users/user.routes.js'

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

  app.use('/api/tasks', taskRouter)
  app.use('/api/users', userRouter)
  app.use('/api/metrics', metricRouter)

  app.use(errorHandler)

  return app
}
