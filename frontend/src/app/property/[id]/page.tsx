"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"
import { AdvancedFilters } from "@/components/dashboard/AdvancedFilters"
import { 
  RatingDistributionChart, 
  ChannelBreakdownChart, 
  CategoryPerformanceChart 
} from "@/components/charts"
import { useProperties } from "@/hooks/useProperties"
import { useReviews } from "@/hooks/useReviews"
import { 
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Filter,
  RefreshCw,
  Building2
} from "lucide-react"
import Link from "next/link"
import { getRatingColor, getRatingLabel, getRelativeTime } from "@/lib/utils"

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyId = params.id as string
  
  const { properties, loading: propertiesLoading, getPropertyById } = useProperties()
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviews({ propertyId })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    rating: 'all',
    channel: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    propertyId: propertyId,
    status: 'all'
  })

  const property = getPropertyById(propertyId)

  useEffect(() => {
    if (!propertiesLoading && !reviewsLoading) {
      setLoading(false)
    }
  }, [propertiesLoading, reviewsLoading])

  // Filter reviews based on current filters
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (filters.search && !review.publicReview.toLowerCase().includes(filters.search.toLowerCase()) && 
          !review.guestName.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.rating && filters.rating !== 'all' && review.rating && review.rating < parseInt(filters.rating)) {
        return false
      }
      if (filters.channel && filters.channel !== 'all' && review.channel !== filters.channel) {
        return false
      }
      if (filters.status && filters.status !== 'all' && review.status !== filters.status) {
        return false
      }
      if (filters.dateFrom && new Date(review.submittedAt) < new Date(filters.dateFrom)) {
        return false
      }
      if (filters.dateTo && new Date(review.submittedAt) > new Date(filters.dateTo)) {
        return false
      }
      if (filters.category && filters.category !== 'all' && review.reviewCategory) {
        const hasCategory = review.reviewCategory.some(cat => cat.category === filters.category)
        if (!hasCategory) return false
      }
      return true
    })
  }, [reviews, filters])

  const ratingDistribution = useMemo(() => {
    const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    filteredReviews.forEach(review => {
      if (review.rating) {
        distribution[review.rating.toString() as keyof typeof distribution]++
      }
    })
    return Object.entries(distribution).map(([rating, count]) => ({
      rating,
      count,
      percentage: filteredReviews.length > 0 ? Math.round((count / filteredReviews.length) * 100) : 0
    }))
  }, [filteredReviews])

  const channelBreakdown = useMemo(() => {
    const channels: { [key: string]: number } = {}
    filteredReviews.forEach(review => {
      const channel = review.channel || 'unknown'
      channels[channel] = (channels[channel] || 0) + 1
    })
    return Object.entries(channels).map(([channel, count]) => ({
      channel: channel.charAt(0).toUpperCase() + channel.slice(1),
      count,
      percentage: filteredReviews.length > 0 ? Math.round((count / filteredReviews.length) * 100) : 0
    }))
  }, [filteredReviews])

  const categoryPerformance = useMemo(() => {
    const categoryReviews = filteredReviews.reduce((acc: any, review) => {
      if (review.reviewCategory) {
        review.reviewCategory.forEach((cat: any) => {
          if (!acc[cat.category]) {
            acc[cat.category] = { total: 0, sum: 0 }
          }
          acc[cat.category].total += 1
          acc[cat.category].sum += cat.rating
        })
      }
      return acc
    }, {})

    const categories = ['cleanliness', 'communication', 'check_in', 'accuracy', 'location', 'value']
    return categories.map(category => {
      const categoryData = categoryReviews[category]
      return {
        category,
        average: categoryData ? categoryData.sum / categoryData.total : 0,
        fullMark: 5
      }
    })
  }, [filteredReviews])

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      rating: 'all',
      channel: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      propertyId: propertyId,
      status: 'all'
    })
  }

  const handleRefresh = () => {
    fetchReviews()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Navigation />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Loading property details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Navigation />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">Property Not Found</h1>
              <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
              <Link href="/properties">
                <Button className="flex-living-button">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const averageRating = filteredReviews.length > 0 
    ? filteredReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / filteredReviews.length 
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation />
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/properties">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-bold flex-living-gradient-text mb-2">{property.name}</h1>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-warning" />
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{filteredReviews.length} reviews</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <Building2 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="flex-living-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-living-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{filteredReviews.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-living-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Review</p>
                    <p className="text-sm font-semibold">
                      {filteredReviews.length > 0 
                        ? getRelativeTime(filteredReviews[0].submittedAt)
                        : 'No reviews'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-living-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-info" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="text-sm font-semibold">{property.propertyType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Filters */}
          <div className="mb-8">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              properties={[{ id: propertyId, name: property.name }]}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RatingDistributionChart data={ratingDistribution} />
            <ChannelBreakdownChart data={channelBreakdown} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <CategoryPerformanceChart data={categoryPerformance} />
          </div>

          {/* Reviews List */}
          <Card className="flex-living-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Guest Reviews ({filteredReviews.length})</span>
              </CardTitle>
              <CardDescription>
                Reviews and feedback from guests who stayed at this property
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filters.search || filters.rating || filters.channel || filters.category || filters.status
                      ? 'Try adjusting your filters to see more reviews.'
                      : 'This property doesn\'t have any reviews yet.'
                    }
                  </p>
                  {(filters.search || filters.rating || filters.channel || filters.category || filters.status) && (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredReviews.map((review, index) => (
                    <div key={review._id || review.id || index} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {review.guestName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{review.guestName}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < (review.rating || 0)
                                        ? 'fill-current text-warning'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {getRelativeTime(review.submittedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {review.channel}
                          </Badge>
                          <Badge 
                            variant={review.status === 'published' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {review.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-foreground mb-4 leading-relaxed">
                        {review.publicReview}
                      </p>

                      {review.reviewCategory && review.reviewCategory.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {review.reviewCategory.map((category, catIndex) => (
                            <div key={catIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                              <span className="text-sm font-medium capitalize">
                                {category.category.replace('_', ' ')}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-current text-warning" />
                                <span className="text-sm font-semibold">{category.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {review.response && (
                        <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                          <div className="flex items-center space-x-2 mb-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">Host Response</span>
                          </div>
                          <p className="text-sm text-foreground">{review.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}