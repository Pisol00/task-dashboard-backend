import { z } from 'zod'

const TAG = ['Feature', 'Bug', 'Chore', 'Docs'] as const
const PRIORITY = ['Low', 'Medium', 'High'] as const
const STATUS = ['To Do', 'In Progress', 'Done'] as const

export const taskListQuerySchema = z.object({
  q: z.string().optional(),
  priority: z.union([z.enum(PRIORITY), z.literal('All')]).optional(),
  status: z.union([z.enum(STATUS), z.literal('All')]).optional(),
  tag: z.union([z.enum(TAG), z.literal('All')]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(3),
})

const assigneeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatarUrl: z.string().optional(),
})

const baseTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000).optional(),
  tag: z.enum(TAG),
  priority: z.enum(PRIORITY),
  status: z.enum(STATUS),
  progress: z.number().int().min(0).max(100),
  dueDate: z.iso.date(),
  assignees: z.array(assigneeSchema).default([]),
})

export const taskCreateSchema = baseTaskSchema

export const taskUpdateSchema = baseTaskSchema.partial()

export const taskIdParamsSchema = z.object({
  id: z.string().min(1),
})

export type TaskListQuery = z.infer<typeof taskListQuerySchema>
export type TaskCreateInput = z.infer<typeof taskCreateSchema>
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>
