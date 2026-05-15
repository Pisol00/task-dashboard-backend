import { prisma } from '../../config/prisma.js'
import { toMetricPointWire } from './metric.mapper.js'
import type { MetricsQuery } from './metric.schema.js'
import type { DailyMetricsWire } from './metric.types.js'

function emptyDay(date: string): DailyMetricsWire {
  return {
    date,
    points: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      green: 0,
      orange: 0,
      blue: 0,
    })),
  }
}

export async function getDailyMetrics(query: MetricsQuery): Promise<DailyMetricsWire> {
  const dateString = query.date ?? new Date().toISOString().slice(0, 10)
  const date = new Date(`${dateString}T00:00:00Z`)

  const rows = await prisma.metricPoint.findMany({
    where: { date },
    orderBy: { hour: 'asc' },
  })

  if (rows.length === 0) return emptyDay(dateString)

  const byHour = new Map(rows.map((r) => [r.hour, toMetricPointWire(r)]))
  const points = Array.from({ length: 24 }, (_, hour) => {
    return byHour.get(hour) ?? { hour, green: 0, orange: 0, blue: 0 }
  })

  return { date: dateString, points }
}
