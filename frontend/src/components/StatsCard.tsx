import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  className?: string
  iconClassName?: string
  valueClassName?: string
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  className,
  iconClassName,
  valueClassName
}: StatsCardProps) => {
  return (
    <Card className={cn("flex-living-card flex-living-glow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5 text-primary flex-living-pulse", iconClassName)} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-4xl font-bold flex-living-gradient-text", valueClassName)}>
          {value}
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
