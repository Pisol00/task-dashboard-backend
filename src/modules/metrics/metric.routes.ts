import { Router } from 'express'
import { validate } from '../../middlewares/validate.js'
import { getDailyMetricsHandler } from './metric.controller.js'
import { metricsQuerySchema } from './metric.schema.js'

export const metricRouter: Router = Router()

metricRouter.get('/', validate({ query: metricsQuerySchema }), getDailyMetricsHandler)
