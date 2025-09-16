"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/ui/navigation"
import { ReviewCard } from "@/components/ReviewCard"
import { useReviews } from "@/hooks/useReviews"
import { ReviewFilters } from "@/types"
import { REVIEW_CATEGORIES, REVIEW_CHANNELS } from "@/lib/utils"
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  Star,
  Calendar,
  User,
  Building2,
  RefreshCw,
  Download,
  Upload
} from "lucide-react"

export default function ReviewsPage() {
  const { 
    reviews, 
    loading, 
    error,
    fetchReviews,
    updateReviewApproval,
    bulkUpdateApprovals,
    syncHostawayReviews,
    syncGoogleReviews
  } = useReviews({ autoFetch: true })
  
  const [filters, setFilters] = useState<ReviewFilters>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [isBulkLoading, setIsBulkLoading] = useState(false)

  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value === '' || value === 'all' ? undefined : value
    }
    setFilters(newFilters)
    fetchReviews(newFilters)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchReviews({ ...filters, search: value })
  }

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  const handleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(reviews.map(review => review.id))
    }
  }

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedReviews.length === 0) return
    
    setIsBulkLoading(true)
    try {
      await bulkUpdateApprovals(selectedReviews, action === 'approve', action === 'approve')
      setSelectedReviews([])
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setIsBulkLoading(false)
    }
  }

  const handleSyncHostaway = async () => {
    try {
      await syncHostawayReviews()
    } catch (error) {
      console.error('Hostaway sync failed:', error)
    }
  }

  const handleSyncGoogle = async () => {
    try {
      await syncGoogleReviews()
    } catch (error) {
      console.error('Google sync failed:', error)
    }
  }

  const filteredReviews = reviews.filter(review =>
    review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.publicReview.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.listingName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Navigation />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    )
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
                <h1 className="text-5xl font-bold flex-living-gradient-text mb-3">Reviews Management</h1>
                <p className="flex-living-text-printemps text-xl">
                  Manage and moderate guest reviews across all properties
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncHostaway}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Sync Hostaway
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncGoogle}
                  disabled={loading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Sync Google
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchReviews()}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="flex-living-card mb-8 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Error loading reviews</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Filters and Search */}
          <Card className="flex-living-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <Select
                    value={filters.rating?.toString() || 'all'}
                    onValueChange={(value) => handleFilterChange('rating', value === 'all' ? undefined : parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All ratings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Channel</label>
                  <Select
                    value={filters.channel || 'all'}
                    onValueChange={(value) => handleFilterChange('channel', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All channels</SelectItem>
                      {Object.entries(REVIEW_CHANNELS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status === undefined ? 'all' : filters.status.toString()}
                    onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="true">Approved</SelectItem>
                      <SelectItem value="false">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedReviews.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleBulkAction('approve')}
                      disabled={isBulkLoading}
                      className="bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isBulkLoading ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleBulkAction('reject')}
                      disabled={isBulkLoading}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {isBulkLoading ? 'Processing...' : 'Reject'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews List */}
          <Card className="flex-living-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Reviews ({filteredReviews.length})</span>
                  </CardTitle>
                  <CardDescription>
                    Guest reviews and feedback
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedReviews.length === filteredReviews.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredReviews.length > 0 ? (
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="relative">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => handleSelectReview(review.id)}
                        className="absolute top-4 left-4 h-4 w-4 text-primary"
                      />
                      <div className="ml-8">
                        <ReviewCard 
                          review={review} 
                          showActions={true}
                          onApprove={(id) => updateReviewApproval(id, true, true)}
                          onReject={(id) => updateReviewApproval(id, false, false)}
                          onAddResponse={(id) => {
                            const response = prompt('Enter your response:');
                            if (response) {
                              // This would need to be implemented in the hook
                              console.log('Adding response:', response);
                            }
                          }}
                          isUpdating={isBulkLoading}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reviews found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || Object.values(filters).some(f => f !== undefined)
                      ? 'Try adjusting your search or filters'
                      : 'No reviews available at the moment'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}