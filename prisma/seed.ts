import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is not set')

const adapter = new PrismaPg({ connectionString: databaseUrl })
const prisma = new PrismaClient({ adapter })

const USERS = [
  { id: 'u1', name: 'Alex Dawson', avatarUrl: 'https://i.pravatar.cc/80?img=12' },
  { id: 'u2', name: 'Bella Rivera', avatarUrl: 'https://i.pravatar.cc/80?img=32' },
  { id: 'u3', name: 'Chen Wei', avatarUrl: 'https://i.pravatar.cc/80?img=47' },
  { id: 'u4', name: 'Dara Okoye', avatarUrl: 'https://i.pravatar.cc/80?img=23' },
  { id: 'u5', name: 'Emi Tanaka', avatarUrl: 'https://i.pravatar.cc/80?img=56' },
]

type SeedTask = {
  id: string
  title: string
  description?: string
  tag: 'FEATURE' | 'BUG' | 'CHORE' | 'DOCS'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  progress: number
  dueDate: string
  assigneeIds: string[]
}

const TASKS: SeedTask[] = [
  { id: 't1', title: 'Implement Dark Mode', description: 'Add dark mode toggle to the global navigation and persist user preference.', tag: 'FEATURE', priority: 'MEDIUM', status: 'TODO', progress: 0, dueDate: '2026-05-28', assigneeIds: ['u1', 'u2', 'u3'] },
  { id: 't2', title: 'Implement Dark Mode Toggle', description: 'Wire the toggle component into the settings panel.', tag: 'FEATURE', priority: 'MEDIUM', status: 'IN_PROGRESS', progress: 45, dueDate: '2026-05-28', assigneeIds: ['u2', 'u4', 'u5'] },
  { id: 't3', title: 'Promise leak determination', description: 'Investigate dangling promises causing memory pressure in production.', tag: 'BUG', priority: 'HIGH', status: 'DONE', progress: 100, dueDate: '2026-05-28', assigneeIds: ['u1'] },
  { id: 't4', title: 'Implement announce banner', description: 'Top-of-page banner for service announcements.', tag: 'FEATURE', priority: 'LOW', status: 'TODO', progress: 0, dueDate: '2026-05-28', assigneeIds: ['u3', 'u4'] },
  { id: 't5', title: 'Dark mode editor support', description: 'Ensure the embedded code editor respects dark mode tokens.', tag: 'FEATURE', priority: 'MEDIUM', status: 'IN_PROGRESS', progress: 45, dueDate: '2026-05-29', assigneeIds: ['u1', 'u3'] },
  { id: 't6', title: 'Implement Dark Mode Toggle (mobile)', description: 'Mirror the desktop toggle on the mobile drawer.', tag: 'FEATURE', priority: 'HIGH', status: 'DONE', progress: 100, dueDate: '2026-05-30', assigneeIds: ['u2', 'u5'] },
  { id: 't7', title: 'Fix login redirect loop', description: 'Users bouncing between /login and /dashboard after SSO.', tag: 'BUG', priority: 'HIGH', status: 'IN_PROGRESS', progress: 60, dueDate: '2026-05-20', assigneeIds: ['u1', 'u4'] },
  { id: 't8', title: 'Refactor task store', description: 'Decouple task list query from board layout component.', tag: 'CHORE', priority: 'LOW', status: 'TODO', progress: 0, dueDate: '2026-06-01', assigneeIds: ['u3'] },
  { id: 't9', title: 'Write contributing guide', description: 'Document branch naming, commit style, and merge rules.', tag: 'DOCS', priority: 'LOW', status: 'DONE', progress: 100, dueDate: '2026-05-12', assigneeIds: ['u5'] },
  { id: 't10', title: 'Add API rate limiting', description: 'Per-IP rate limit for unauthenticated endpoints.', tag: 'FEATURE', priority: 'HIGH', status: 'TODO', progress: 0, dueDate: '2026-06-05', assigneeIds: ['u2', 'u3'] },
  { id: 't11', title: 'Pagination bug on filter change', description: 'Page index not resetting when filters change.', tag: 'BUG', priority: 'MEDIUM', status: 'IN_PROGRESS', progress: 30, dueDate: '2026-05-22', assigneeIds: ['u4'] },
  { id: 't12', title: 'Upgrade Tailwind to 4.4', tag: 'CHORE', priority: 'LOW', status: 'DONE', progress: 100, dueDate: '2026-05-10', assigneeIds: ['u1', 'u5'] },
  { id: 't13', title: 'Implement task search debounce', description: 'Debounce search input by 300ms to reduce queries.', tag: 'FEATURE', priority: 'MEDIUM', status: 'IN_PROGRESS', progress: 70, dueDate: '2026-05-19', assigneeIds: ['u3', 'u4'] },
  { id: 't14', title: 'Document chart export flow', tag: 'DOCS', priority: 'LOW', status: 'TODO', progress: 0, dueDate: '2026-06-10', assigneeIds: ['u5'] },
  { id: 't15', title: 'Add E2E tests for board', description: 'Playwright tests for filter + pagination + dialogs.', tag: 'CHORE', priority: 'MEDIUM', status: 'TODO', progress: 0, dueDate: '2026-06-15', assigneeIds: ['u1', 'u2'] },
  { id: 't16', title: 'Avatar overlap on small screens', description: 'Assignee stack overflows on widths < 360px.', tag: 'BUG', priority: 'LOW', status: 'DONE', progress: 100, dueDate: '2026-05-08', assigneeIds: ['u2'] },
  { id: 't17', title: 'Sidebar collapse persistence', description: 'Remember sidebar state across sessions.', tag: 'FEATURE', priority: 'LOW', status: 'TODO', progress: 0, dueDate: '2026-06-03', assigneeIds: ['u4', 'u5'] },
  { id: 't18', title: 'Tooltip clipping in chart', description: 'Tooltip cut off near chart edges.', tag: 'BUG', priority: 'MEDIUM', status: 'IN_PROGRESS', progress: 25, dueDate: '2026-05-25', assigneeIds: ['u3'] },
  { id: 't19', title: 'Refresh README screenshots', tag: 'DOCS', priority: 'LOW', status: 'DONE', progress: 100, dueDate: '2026-05-05', assigneeIds: ['u1'] },
  { id: 't20', title: 'PDF export branding', description: 'Include logo and timestamp on exported chart PDF.', tag: 'FEATURE', priority: 'HIGH', status: 'IN_PROGRESS', progress: 55, dueDate: '2026-05-26', assigneeIds: ['u2', 'u3', 'u5'] },
]

function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

function generateMetricPoints(date: string) {
  const rand = seededRandom(date.split('-').reduce((acc, p) => acc + Number(p), 0))
  return Array.from({ length: 24 }, (_, hour) => {
    const t = hour / 23
    const greenBase = 50 + 30 * Math.sin(t * Math.PI * 2)
    const orangeBase = 70 * Math.sin(t * Math.PI * 2 + Math.PI / 4)
    const blueBase = 5 + 3 * Math.sin(t * Math.PI * 3)
    return {
      date: new Date(`${date}T00:00:00Z`),
      hour,
      green: Math.max(0, Math.min(100, greenBase + (rand() - 0.5) * 20)),
      orange: Math.max(-100, Math.min(100, orangeBase + (rand() - 0.5) * 30)),
      blue: Math.max(0, Math.min(10, blueBase + (rand() - 0.5) * 2)),
    }
  })
}

async function main() {
  console.log('[seed] resetting tables...')
  await prisma.metricPoint.deleteMany()
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  console.log('[seed] inserting users...')
  for (const user of USERS) {
    await prisma.user.create({ data: user })
  }

  console.log('[seed] inserting tasks...')
  for (const t of TASKS) {
    await prisma.task.create({
      data: {
        id: t.id,
        title: t.title,
        description: t.description,
        tag: t.tag,
        priority: t.priority,
        status: t.status,
        progress: t.progress,
        dueDate: new Date(t.dueDate),
        assignees: { connect: t.assigneeIds.map((id) => ({ id })) },
      },
    })
  }

  console.log('[seed] inserting metric points...')
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  for (const date of [today, yesterday]) {
    await prisma.metricPoint.createMany({ data: generateMetricPoints(date) })
  }

  console.log(
    `[seed] done: ${USERS.length} users, ${TASKS.length} tasks, 48 metric points (2 days)`,
  )
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
