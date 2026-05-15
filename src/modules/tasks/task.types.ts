export type TaskTagWire = 'Feature' | 'Bug' | 'Chore' | 'Docs'
export type PriorityWire = 'Low' | 'Medium' | 'High'
export type TaskStatusWire = 'To Do' | 'In Progress' | 'Done'

export type AssigneeWire = {
  id: string
  name: string
  avatarUrl?: string
}

export type TaskWire = {
  id: string
  title: string
  description?: string
  tag: TaskTagWire
  priority: PriorityWire
  status: TaskStatusWire
  progress: number
  dueDate: string
  assignees: AssigneeWire[]
  createdAt: string
  updatedAt: string
}

export type Paginated<T> = {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
