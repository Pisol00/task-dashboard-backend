import type { RequestHandler } from 'express'
import * as service from './user.service.js'

export const listUsersHandler: RequestHandler = async (_req, res, next) => {
  try {
    const users = await service.listUsers()
    res.json(users)
  } catch (err) {
    next(err)
  }
}
