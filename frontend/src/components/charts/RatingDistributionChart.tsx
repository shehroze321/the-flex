"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RatingDistributionChartProps {
  data: Array<{
    rating: string
    count: number
    percentage: number
  }>
}

const COLORS = {
  '1': '#ef4444', // red-500
  '2': '#f97316', // orange-500
  '3': '#eab308', // yellow-500
  '4': '#22c55e', // green-500
  '5': '#10b981', // emerald-500
}

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  return (
    <Card className="flex-living-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <span>Rating Distribution</span>
        </CardTitle>
        <CardDescription>
          Distribution of guest ratings across all properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="rating" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  `${value} reviews (${data.find(d => d.rating === name)?.percentage}%)`,
                  'Count'
                ]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} className="cursor-pointer">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.rating as keyof typeof COLORS]} className="cursor-pointer" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
