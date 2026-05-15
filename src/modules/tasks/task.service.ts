import type { Prisma, TaskStatus } from '@prisma/client'
import { prisma } from '../../config/prisma.js'
import { ApiError } from '../../utils/ApiError.js'
import { db, toTaskWire } from './task.mapper.js'
import type {
  TaskCreateInput,
  TaskListQuery,
  TaskUpdateInput,
} from './task.schema.js'
import type { Paginated, TaskWire } from './task.types.js'

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

function buildBaseWhere(query: TaskListQuery): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {}
  if (query.q) {
    where.title = { contains: query.q, mode: 'insensitive' }
  }
  if (query.priority && query.priority !== 'All') {
    where.priority = db.priority(query.priority)
  }
  return where
}

export async function listTasks(query: TaskListQuery): Promise<Paginated<TaskWire>> {
  const { page, limit, status } = query
  const baseWhere = buildBaseWhere(query)

  if (status && status !== 'All') {
    const statusFilter: Prisma.TaskWhereInput = {
      ...baseWhere,
      status: db.status(status),
    }
    const [total, rows] = await Promise.all([
      prisma.task.count({ where: statusFilter }),
      prisma.task.findMany({
        where: statusFilter,
        include: { assignees: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])
    const totalPages = Math.max(1, Math.ceil(total / limit))
    return {
      data: rows.map(toTaskWire),
      page,
      limit,
      total,
      totalPages,
    }
  }

  const perStatus = await Promise.all(
    STATUSES.map(async (s) => {
      const where: Prisma.TaskWhereInput = { ...baseWhere, status: s }
      const [count, slice] = await Promise.all([
        prisma.task.count({ where }),
        prisma.task.findMany({
          where,
          include: { assignees: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ])
      return { count, slice }
    }),
  )

  const totalPages = Math.max(1, ...perStatus.map(({ count }) => Math.ceil(count / limit)))
  const total = perStatus.reduce((sum, { count }) => sum + count, 0)
  const data = perStatus.flatMap(({ slice }) => slice.map(toTaskWire))

  return { data, page, limit, total, totalPages }
}

export async function getTask(id: string): Promise<TaskWire> {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { assignees: true },
  })
  if (!task) throw ApiError.notFound('Task not found')
  return toTaskWire(task)
}

export async function createTask(input: TaskCreateInput): Promise<TaskWire> {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      tag: db.tag(input.tag),
      priority: db.priority(input.priority),
      status: db.status(input.status),
      progress: input.progress,
      dueDate: new Date(input.dueDate),
      assignees: input.assignees.length
        ? { connect: input.assignees.map((a) => ({ id: a.id })) }
        : undefined,
    },
    include: { assignees: true },
  })
  return toTaskWire(task)
}

export async function updateTask(id: string, input: TaskUpdateInput): Promise<TaskWire> {
  const existing = await prisma.task.findUnique({ where: { id } })
  if (!existing) throw ApiError.notFound('Task not found')

  const data: Prisma.TaskUpdateInput = {}
  if (input.title !== undefined) data.title = input.title
  if (input.description !== undefined) data.description = input.description
  if (input.tag !== undefined) data.tag = db.tag(input.tag)
  if (input.priority !== undefined) data.priority = db.priority(input.priority)
  if (input.status !== undefined) data.status = db.status(input.status)
  if (input.progress !== undefined) data.progress = input.progress
  if (input.dueDate !== undefined) data.dueDate = new Date(input.dueDate)
  if (input.assignees !== undefined) {
    data.assignees = { set: input.assignees.map((a) => ({ id: a.id })) }
  }

  const task = await prisma.task.update({
    where: { id },
    data,
    include: { assignees: true },
  })
  return toTaskWire(task)
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await prisma.task.delete({ where: { id } })
  } catch {
    throw ApiError.notFound('Task not found')
  }
}
