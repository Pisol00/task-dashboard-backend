export type MetricPointWire = {
  hour: number
  green: number
  orange: number
  blue: number
}

export type DailyMetricsWire = {
  date: string
  points: MetricPointWire[]
}
