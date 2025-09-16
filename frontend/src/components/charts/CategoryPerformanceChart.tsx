"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CategoryPerformanceChartProps {
  data: Array<{
    category: string
    average: number
    fullMark: number
  }>
}

export function CategoryPerformanceChart({ data }: CategoryPerformanceChartProps) {
  return (
    <Card className="flex-living-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <span>Category Performance</span>
        </CardTitle>
        <CardDescription>
          Average ratings across different review categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              />
              <PolarRadiusAxis 
                domain={[0, 5]} 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Radar
                name="Average Rating"
                dataKey="average"
                stroke="#D4F872"
                fill="#D4F872"
                fillOpacity={0.3}
                strokeWidth={2}
                className="cursor-pointer"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
