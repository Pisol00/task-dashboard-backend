import type { RequestHandler } from 'express'
import { getValidated } from '../../middlewares/validate.js'
import * as service from './task.service.js'
import type { TaskCreateInput, TaskListQuery, TaskUpdateInput } from './task.schema.js'

export const listTasksHandler: RequestHandler = async (_req, res, next) => {
  try {
    const query = getValidated<TaskListQuery>(res, 'query')
    const result = await service.listTasks(query)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getTaskHandler: RequestHandler = async (_req, res, next) => {
  try {
    const { id } = getValidated<{ id: string }>(res, 'params')
    const task = await service.getTask(id)
    res.json(task)
  } catch (err) {
    next(err)
  }
}

export const createTaskHandler: RequestHandler = async (req, res, next) => {
  try {
    const task = await service.createTask(req.body as TaskCreateInput)
    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
}

export const updateTaskHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = getValidated<{ id: string }>(res, 'params')
    const task = await service.updateTask(id, req.body as TaskUpdateInput)
    res.json(task)
  } catch (err) {
    next(err)
  }
}

export const deleteTaskHandler: RequestHandler = async (_req, res, next) => {
  try {
    const { id } = getValidated<{ id: string }>(res, 'params')
    await service.deleteTask(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
