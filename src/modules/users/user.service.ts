import { prisma } from '../../config/prisma.js'
import { toAssigneeWire } from '../tasks/task.mapper.js'
import type { AssigneeWire } from '../tasks/task.types.js'

export async function listUsers(): Promise<AssigneeWire[]> {
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })
  return users.map(toAssigneeWire)
}
