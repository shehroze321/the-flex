import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Review } from '@/types'
import { getRatingColor, getRelativeTime, REVIEW_CATEGORIES, REVIEW_CHANNELS } from '@/lib/utils'
import { Star, Users, CheckCircle, XCircle, MessageSquare } from 'lucide-react'

interface ReviewCardProps {
  review: Review
  className?: string
  showActions?: boolean
  onApprove?: (reviewId: string) => void
  onReject?: (reviewId: string) => void
  onAddResponse?: (reviewId: string) => void
  isUpdating?: boolean
}

export const ReviewCard = ({ 
  review, 
  className, 
  showActions = false, 
  onApprove, 
  onReject, 
  onAddResponse, 
  isUpdating = false 
}: ReviewCardProps) => {
  return (
    <Card className={`flex-living-card p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-lg">{review.guestName}</h4>
              <Badge variant={review.channel === 'hostaway' ? 'default' : 'secondary'}>
                {REVIEW_CHANNELS[review.channel as keyof typeof REVIEW_CHANNELS]}
              </Badge>
              <Badge variant={review.isApproved ? 'default' : 'destructive'}>
                {review.isApproved ? 'Approved' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`text-xl font-bold ${getRatingColor(review?.rating || 0)}`}>
                {review.rating}
              </div>
              <Star className="h-5 w-5 fill-current text-warning" />
              <span className="text-sm text-muted-foreground">
                {getRelativeTime(review.submittedAt)}
              </span>
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApprove?.(review.id)}
              disabled={isUpdating || review.isApproved}
              className="text-success hover:text-success"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject?.(review.id)}
              disabled={isUpdating || !review.isApproved}
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddResponse?.(review.id)}
              disabled={isUpdating}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Respond
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground leading-relaxed mb-4">{review.publicReview}</p>
      
      {/* Host Response */}
      {review.response && (
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Host Response</span>
          </div>
          <p className="text-sm text-muted-foreground">{review.response}</p>
        </div>
      )}
      
      {/* Category Ratings */}
      {review.reviewCategory && review.reviewCategory.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {review.reviewCategory.map((category, index) => (
            <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded-md">
              <span className="text-muted-foreground">
                {REVIEW_CATEGORIES[category.category as keyof typeof REVIEW_CATEGORIES]}
              </span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{category.rating}</span>
                <Star className="h-3 w-3 fill-current text-warning" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
