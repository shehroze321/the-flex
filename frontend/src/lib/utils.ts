import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  return Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600'
  if (rating >= 3.5) return 'text-yellow-600'
  if (rating >= 2.5) return 'text-orange-600'
  return 'text-red-600'
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 3.5) return 'Good'
  if (rating >= 2.5) return 'Fair'
  return 'Poor'
}

export { REVIEW_CATEGORIES, REVIEW_CHANNELS } from '@/constants'

export function generateMockReviews(): any[] {
  const properties = [
    '2B N1 A - 29 Shoreditch Heights',
    '1B N2 B - 15 Brick Lane',
    '3B N3 C - 42 Spitalfields',
    'Studio N4 D - 8 Whitechapel',
    '2B N5 E - 23 Bethnal Green'
  ]

  const channels = ['airbnb', 'booking', 'hostaway', 'google', 'direct']
  const categories = ['cleanliness', 'communication', 'respect_house_rules', 'check_in', 'accuracy', 'location', 'value']
  
  const reviews = []
  const now = new Date()

  for (let i = 1; i <= 50; i++) {
    const property = properties[Math.floor(Math.random() * properties.length)]
    const channel = channels[Math.floor(Math.random() * channels.length)]
    const rating = Math.floor(Math.random() * 5) + 1
    const daysAgo = Math.floor(Math.random() * 365)
    const submittedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    const reviewCategories = categories
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 2)
      .map(category => ({
        category,
        rating: Math.max(1, rating + Math.floor(Math.random() * 3) - 1)
      }))

    reviews.push({
      id: 7000 + i,
      type: Math.random() > 0.8 ? 'host-to-guest' : 'guest-to-host',
      status: 'published',
      rating: rating,
      publicReview: generateMockReviewText(rating),
      reviewCategory: reviewCategories,
      submittedAt: submittedAt.toISOString().replace('T', ' ').substring(0, 19),
      guestName: generateMockName(),
      listingName: property,
      channel,
      isApproved: Math.random() > 0.3,
      isPublic: Math.random() > 0.2
    })
  }

  return reviews.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

function generateMockReviewText(rating: number): string {
  const positiveReviews = [
    "Amazing stay! The property was exactly as described and the location was perfect.",
    "Great communication from the host and everything was clean and well-maintained.",
    "Would definitely recommend this place to anyone visiting the area.",
    "Perfect location and the apartment had everything we needed for our stay.",
    "Excellent value for money and the host was very responsive to our needs."
  ]

  const negativeReviews = [
    "The property didn't meet our expectations. Several issues that weren't addressed.",
    "Communication could have been better. Had some problems during check-in.",
    "The place was okay but there were some cleanliness issues that need attention.",
    "Not quite what we expected based on the photos. Some maintenance needed.",
    "Average stay overall. Some good points but several areas for improvement."
  ]

  const reviews = rating >= 4 ? positiveReviews : rating >= 3 ? [...positiveReviews, ...negativeReviews] : negativeReviews
  return reviews[Math.floor(Math.random() * reviews.length)]
}

function generateMockName(): string {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Anna', 'Robert', 'Maria']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  
  return `${firstName} ${lastName}`
}
