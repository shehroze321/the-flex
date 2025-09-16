"use client"

import { StatsCard } from '@/components/StatsCard'
import { PropertyCard } from '@/components/PropertyCard'
import { Navigation } from '@/components/ui/navigation'
import { useProperties } from '@/hooks/useProperties'
import { useReviews } from '@/hooks/useReviews'
import { Building2, Star, MessageSquare } from 'lucide-react'

export default function PropertiesPage() {
  const { properties, loading, error } = useProperties()
  const { reviews } = useReviews()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Navigation />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Loading properties...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Navigation />
          <div className="flex-1 p-8">
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-destructive mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">Error Loading Properties</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review?.rating || 0), 0) / reviews.length 
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation />
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold flex-living-gradient-text mb-3">Property Portfolio</h1>
            <p className="flex-living-text-printemps text-xl">
              Manage and monitor your property portfolio performance
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Properties"
              value={properties.length}
              description="Active properties"
              icon={Building2}
              iconClassName="flex-living-floating"
            />
            <StatsCard
              title="Average Rating"
              value={averageRating.toFixed(1)}
              description="Portfolio average"
              icon={Star}
              iconClassName="flex-living-bounce"
            />
            <StatsCard
              title="Total Reviews"
              value={reviews.length}
              description="Across all properties"
              icon={MessageSquare}
              iconClassName="flex-living-pulse"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Performance Insights */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Performance Insights</h3>
              <p className="text-muted-foreground">
                Your properties are performing well with an average rating of {averageRating.toFixed(1)} stars. 
                Keep up the excellent work in maintaining high guest satisfaction!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}