"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Active Students",
    color: "darkblue",
  },
} satisfies ChartConfig

interface AnalyticsChartProps {
  data: { date: string; total: number }[]
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-20 w-50">
      <LineChart 
        accessibilityLayer 
        data={data}
        margin={{ left: 12, right: 12, top: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value);
            return isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
        />
        <ChartTooltip 
          cursor={false}
          content={<ChartTooltipContent indicator="line" />} 
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="var(--color-total)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}