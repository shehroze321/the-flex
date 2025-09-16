"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"
import { StatsCard } from "@/components/StatsCard"
import { AdvancedFilters } from "@/components/dashboard/AdvancedFilters"
import { 
  RatingDistributionChart, 
  MonthlyTrendsChart, 
  ChannelBreakdownChart, 
  CategoryPerformanceChart 
} from "@/components/charts"
import { useProperties } from "@/hooks/useProperties"
import { useReviews } from "@/hooks/useReviews"
import { 
  BarChart3, 
  MessageSquare, 
  Building2, 
  Star,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { getRatingColor, getRatingLabel, getRelativeTime } from "@/lib/utils"

export default function DashboardPage() {
  // All hooks must be called in the same order every time
  const { properties, loading: propertiesLoading } = useProperties()
  const { reviews, loading: reviewsLoading, getAverageRating, fetchReviews } = useReviews()
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    rating: 'all',
    channel: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    propertyId: 'all',
    status: 'all'
  })

  // All useMemo hooks must be called consistently
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
      if (filters.propertyId && filters.propertyId !== 'all' && review.propertyId !== filters.propertyId) {
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

  const monthlyTrends = useMemo(() => {
    const trends: { [key: string]: { count: number; totalRating: number } } = {}
    filteredReviews.forEach(review => {
      const month = new Date(review.submittedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!trends[month]) {
        trends[month] = { count: 0, totalRating: 0 }
      }
      trends[month].count++
      if (review.rating) {
        trends[month].totalRating += review.rating
      }
    })
    return Object.entries(trends).map(([month, data]) => ({
      month,
      count: data.count,
      averageRating: data.count > 0 ? data.totalRating / data.count : 0
    })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
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

  // All useEffect hooks must be called consistently
  useEffect(() => {
    if (!propertiesLoading && !reviewsLoading) {
      setLoading(false)
    }
  }, [propertiesLoading, reviewsLoading])

  // Early return after all hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Navigation />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const averageRating = getAverageRating()
  const totalReviews = filteredReviews.length
  const activeProperties = properties.filter(p => p.isActive).length
  const issuesToAddress = properties.filter(p => p.averageRating < 4).length

  // Get recent reviews (last 5)
  const recentReviews = filteredReviews
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

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
      propertyId: 'all',
      status: 'all'
    })
  }

  const handleRefresh = () => {
    fetchReviews()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation />
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold flex-living-gradient-text mb-3">Reviews Dashboard</h1>
                <p className="flex-living-text-printemps text-xl">
                  Monitor property performance and manage guest reviews
                </p>
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
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Link href="/reviews">
                  <Button className="flex-living-button">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Manage Reviews
                  </Button>
                </Link>
                <Link href="/properties">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <Building2 className="h-4 w-4 mr-2" />
                    View Properties
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mb-8">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              properties={properties.map(p => ({ id: p.id, name: p.name }))}
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Reviews"
              value={totalReviews}
              description="Across all properties"
              icon={MessageSquare}
              iconClassName="flex-living-pulse"
            />
            <StatsCard
              title="Average Rating"
              value={averageRating.toFixed(1)}
              description={getRatingLabel(averageRating || 0)}
              icon={Star}
              iconClassName="flex-living-bounce"
              valueClassName={getRatingColor(averageRating || 0)}
            />
            <StatsCard
              title="Active Properties"
              value={activeProperties}
              description="Properties with reviews"
              icon={Building2}
              iconClassName="flex-living-floating"
            />
            <StatsCard
              title="Issues to Address"
              value={issuesToAddress}
              description="Properties needing attention"
              icon={AlertTriangle}
              iconClassName="flex-living-pulse"
              valueClassName="text-destructive"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RatingDistributionChart data={ratingDistribution} />
            <ChannelBreakdownChart data={channelBreakdown} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <MonthlyTrendsChart data={monthlyTrends} />
            <CategoryPerformanceChart data={categoryPerformance} />
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Performing Properties */}
            <Card className="flex-living-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span>Top Performing Properties</span>
                </CardTitle>
                <CardDescription>
                  Properties with highest ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties
                    .filter(p => p.averageRating >= 4.5)
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 3)
                    .map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{property.name}</h4>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`text-lg font-bold ${getRatingColor(property.averageRating)}`}>
                            {property.averageRating}
                          </div>
                          <Star className="h-4 w-4 fill-current text-warning" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Properties Needing Attention */}
            <Card className="flex-living-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <span>Properties Needing Attention</span>
                </CardTitle>
                <CardDescription>
                  Properties with ratings below 4.0
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties
                    .filter(p => p.averageRating < 4.0)
                    .sort((a, b) => a.averageRating - b.averageRating)
                    .slice(0, 3)
                    .map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                        <div>
                          <h4 className="font-semibold">{property.name}</h4>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`text-lg font-bold ${getRatingColor(property.averageRating)}`}>
                            {property.averageRating}
                          </div>
                          <Star className="h-4 w-4 fill-current text-warning" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reviews */}
          <Card className="flex-living-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>
                    Latest guest feedback
                  </CardDescription>
                </div>
                <Link href="/reviews">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div key={review._id || review.id || index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`text-sm font-semibold ${getRatingColor(review.rating || 0)}`}>
                          {review.rating}
                        </div>
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                      <Badge variant={review.isApproved ? "success" : "secondary"}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {review.publicReview}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{review.guestName}</span>
                      <span>{getRelativeTime(review.submittedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}