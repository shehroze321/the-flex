"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { 
  BarChart3, 
  Home, 
  MessageSquare, 
  Settings, 
  Star,
  Building2,
  Filter,
  Users
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: Star },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1 p-4">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Flex Living</h1>
            <p className="text-xs text-muted-foreground">Reviews Dashboard</p>
          </div>
        </div>
      </div>
      
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md border-l-4 border-primary" 
                  : "hover:bg-primary/10 hover:text-primary"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-1 p-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2",
                isActive && "bg-secondary text-secondary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs">{item.name}</span>
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
