import { Router } from 'express'
import { listUsersHandler } from './user.controller.js'

export const userRouter: Router = Router()

userRouter.get('/', listUsersHandler)
