import { Router } from 'express'
import { validate } from '../../middlewares/validate.js'
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  listTasksHandler,
  updateTaskHandler,
} from './task.controller.js'
import {
  taskCreateSchema,
  taskIdParamsSchema,
  taskListQuerySchema,
  taskUpdateSchema,
} from './task.schema.js'

export const taskRouter: Router = Router()

taskRouter.get('/', validate({ query: taskListQuerySchema }), listTasksHandler)
taskRouter.get('/:id', validate({ params: taskIdParamsSchema }), getTaskHandler)
taskRouter.post('/', validate({ body: taskCreateSchema }), createTaskHandler)
taskRouter.patch(
  '/:id',
  validate({ params: taskIdParamsSchema, body: taskUpdateSchema }),
  updateTaskHandler,
)
taskRouter.delete('/:id', validate({ params: taskIdParamsSchema }), deleteTaskHandler)
