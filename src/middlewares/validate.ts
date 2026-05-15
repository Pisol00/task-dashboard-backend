import type { RequestHandler } from 'express'
import { z, type ZodType } from 'zod'
import { ApiError } from '../utils/ApiError.js'

type Schemas = {
  body?: ZodType
  query?: ZodType
  params?: ZodType
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      validated?: {
        body?: unknown
        query?: unknown
        params?: unknown
      }
    }
  }
}

/**
 * Express 5 makes req.query and req.params read-only getters, so we cannot
 * mutate them. Instead we stash the parsed values on res.locals.validated.*
 * and let controllers read them via the getValidated() helper.
 */
export function validate(schemas: Schemas): RequestHandler {
  return (req, res, next) => {
    try {
      const validated: Record<string, unknown> = {}
      if (schemas.body) {
        validated.body = schemas.body.parse(req.body)
        req.body = validated.body
      }
      if (schemas.query) {
        validated.query = schemas.query.parse(req.query)
      }
      if (schemas.params) {
        validated.params = schemas.params.parse(req.params)
      }
      res.locals.validated = { ...res.locals.validated, ...validated }
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

export function getValidated<T>(
  res: { locals: Express.Locals },
  key: 'body' | 'query' | 'params',
): T {
  const value = res.locals.validated?.[key]
  if (value === undefined) {
    throw new Error(`No validated ${key} found — did you forget validate({ ${key}: ... })?`)
  }
  return value as T
}
