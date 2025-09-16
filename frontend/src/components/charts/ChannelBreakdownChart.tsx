"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChannelBreakdownChartProps {
  data: Array<{
    channel: string
    count: number
    percentage: number
  }>
}

const COLORS = ['#D4F872', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export function ChannelBreakdownChart({ data }: ChannelBreakdownChartProps) {
  return (
    <Card className="flex-living-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <span>Channel Breakdown</span>
        </CardTitle>
        <CardDescription>
          Distribution of reviews by booking channel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ channel, percentage }) => `${channel} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                className="cursor-pointer"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  `${value} reviews`,
                  'Count'
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
