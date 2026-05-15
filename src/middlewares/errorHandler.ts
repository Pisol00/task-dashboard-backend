import type { ErrorRequestHandler } from 'express'
import { ApiError } from '../utils/ApiError.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      message: err.message,
      details: err.details,
    })
    return
  }

  console.error('[unhandled]', err)
  res.status(500).json({ message: 'Internal server error' })
}
