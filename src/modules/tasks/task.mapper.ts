import type { Priority, Task, TaskStatus, TaskTag, User } from '@prisma/client'
import type { AssigneeWire, PriorityWire, TaskStatusWire, TaskTagWire, TaskWire } from './task.types.js'

const TAG_TO_WIRE: Record<TaskTag, TaskTagWire> = {
  FEATURE: 'Feature',
  BUG: 'Bug',
  CHORE: 'Chore',
  DOCS: 'Docs',
}

const TAG_TO_DB: Record<TaskTagWire, TaskTag> = {
  Feature: 'FEATURE',
  Bug: 'BUG',
  Chore: 'CHORE',
  Docs: 'DOCS',
}

const PRIORITY_TO_WIRE: Record<Priority, PriorityWire> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

const PRIORITY_TO_DB: Record<PriorityWire, Priority> = {
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH',
}

const STATUS_TO_WIRE: Record<TaskStatus, TaskStatusWire> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const STATUS_TO_DB: Record<TaskStatusWire, TaskStatus> = {
  'To Do': 'TODO',
  'In Progress': 'IN_PROGRESS',
  Done: 'DONE',
}

export const wire = {
  tag: (t: TaskTag): TaskTagWire => TAG_TO_WIRE[t],
  priority: (p: Priority): PriorityWire => PRIORITY_TO_WIRE[p],
  status: (s: TaskStatus): TaskStatusWire => STATUS_TO_WIRE[s],
}

export const db = {
  tag: (t: TaskTagWire): TaskTag => TAG_TO_DB[t],
  priority: (p: PriorityWire): Priority => PRIORITY_TO_DB[p],
  status: (s: TaskStatusWire): TaskStatus => STATUS_TO_DB[s],
}

export function toAssigneeWire(user: User): AssigneeWire {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl ?? undefined,
  }
}

type TaskWithAssignees = Task & { assignees: User[] }

export function toTaskWire(task: TaskWithAssignees): TaskWire {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    tag: wire.tag(task.tag),
    priority: wire.priority(task.priority),
    status: wire.status(task.status),
    progress: task.progress,
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : '',
    assignees: task.assignees.map(toAssigneeWire),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }
}
