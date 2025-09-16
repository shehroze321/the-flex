import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Property } from '@/types'
import { getRatingColor, getRatingLabel } from '@/lib/utils'
import { MapPin, Calendar, Eye, Settings } from 'lucide-react'

interface PropertyCardProps {
  property: Property
  className?: string
}

export const PropertyCard = ({ property, className }: PropertyCardProps) => {
  return (
    <Link href={`/property/${property.id}`}>
      <Card className={`flex-living-card group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 hover:border-primary/20 ${className}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{property.name}</CardTitle>
              <CardDescription className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{property.address}</span>
              </CardDescription>
            </div>
            <Badge variant={property.isActive ? "success" : "secondary"}>
              {property.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Property Image */}
          <div className="w-full h-48 rounded-lg mb-4 relative overflow-hidden group">
            <img
              src={`https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80&ixlib=rb-4.0.3&ixid=${property.id}`}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center hidden">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="h-8 w-8 bg-primary/40 rounded"></div>
                </div>
                <p className="text-sm text-primary font-medium">Property Image</p>
              </div>
            </div>
          </div>

          {/* Rating and Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${getRatingColor(property.averageRating)}`}>
                  {property.averageRating}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-5 w-5 bg-warning rounded-sm"></div>
                  <span className="text-sm text-muted-foreground">
                    {getRatingLabel(property.averageRating)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{property.totalReviews}</div>
                <div className="text-xs text-muted-foreground">reviews</div>
              </div>
            </div>

            {property.lastReviewDate && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last review: {new Date(property.lastReviewDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View Reviews
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
