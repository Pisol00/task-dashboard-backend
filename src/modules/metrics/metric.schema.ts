import { z } from 'zod'

export const metricsQuerySchema = z.object({
  date: z.iso.date().optional(),
})

export type MetricsQuery = z.infer<typeof metricsQuerySchema>
