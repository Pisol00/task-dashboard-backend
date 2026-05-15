import type { MetricPoint } from '@prisma/client'
import type { MetricPointWire } from './metric.types.js'

export function toMetricPointWire(p: MetricPoint): MetricPointWire {
  return {
    hour: p.hour,
    green: p.green,
    orange: p.orange,
    blue: p.blue,
  }
}
