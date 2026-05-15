import type { RequestHandler } from 'express'
import { getValidated } from '../../middlewares/validate.js'
import * as service from './metric.service.js'
import type { MetricsQuery } from './metric.schema.js'

export const getDailyMetricsHandler: RequestHandler = async (_req, res, next) => {
  try {
    const query = getValidated<MetricsQuery>(res, 'query')
    const result = await service.getDailyMetrics(query)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
