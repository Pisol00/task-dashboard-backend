import type { RequestHandler } from 'express'
import { z, type ZodType } from 'zod'
import { ApiError } from '../utils/ApiError.js'

type Schemas = {
  body?: ZodType
  query?: ZodType
  params?: ZodType
}

export function validate(schemas: Schemas): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body)
      if (schemas.query) req.query = schemas.query.parse(req.query) as typeof req.query
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params
      next()
    } catch (err) {
      if (err instanceof z.ZodError) {
        next(ApiError.badRequest('Validation failed', z.treeifyError(err)))
        return
      }
      next(err)
    }
  }
}
