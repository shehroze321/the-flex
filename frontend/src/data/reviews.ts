import { Review } from '@/types'
import { mockProperties } from './properties'

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    listingName: '2B N1 A - 29 Shoreditch Heights',
    guestName: 'Sarah Johnson',
    rating: 5,
    publicReview: 'Absolutely fantastic stay! The apartment was spotless and beautifully furnished. Perfect location in Shoreditch with easy access to everything.',
    privateReview: 'Guest was very clean and respectful. No issues during their stay.',
    submittedAt: '2024-08-10T10:00:00Z',
    channel: 'booking.com',
    reviewCategory: [
      { category: 'cleanliness', rating: 5 },
      { category: 'communication', rating: 5 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 4 }
    ],
    isApproved: true,
    isPublic: true,
    response: 'Thank you Sarah! We\'re delighted you enjoyed your stay. Looking forward to hosting you again!'
  },
  {
    id: 'rev-2',
    listingName: '1B N2 B - 15 Brick Lane',
    guestName: 'Michael Chen',
    rating: 4,
    publicReview: 'Great location on Brick Lane! The flat was cozy and had everything we needed. The kitchen was well-equipped.',
    privateReview: 'Guest left the place in good condition. Minor cleaning required.',
    submittedAt: '2024-09-10T10:00:00Z',
    channel: 'airbnb',
    reviewCategory: [
      { category: 'cleanliness', rating: 4 },
      { category: 'communication', rating: 5 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 4 }
    ],
    isApproved: true,
    isPublic: true,
    response: 'Thanks Michael! We\'re glad you enjoyed the vibrant Brick Lane area.'
  },
  {
    id: 'rev-3',
    listingName: '3B N3 C - 42 Spitalfields',
    guestName: 'Emma Williams',
    rating: 3,
    publicReview: 'The house was spacious and well-located. However, there were some maintenance issues that need attention.',
    privateReview: 'Guest reported several issues: broken shower head, noisy heating system. Need to address these.',
    submittedAt: '2024-08-15T10:00:00Z',
    channel: 'booking.com',
    reviewCategory: [
      { category: 'cleanliness', rating: 4 },
      { category: 'communication', rating: 3 },
      { category: 'location', rating: 4 },
      { category: 'value', rating: 3 }
    ],
    isApproved: true,
    isPublic: true,
    response: 'Thank you for the feedback Emma. We\'ve addressed the maintenance issues and appreciate your patience.'
  },
  {
    id: 'rev-4',
    listingName: 'Studio N4 D - 8 Whitechapel',
    guestName: 'David Rodriguez',
    rating: 5,
    publicReview: 'Perfect studio for a solo traveler! Clean, modern, and everything worked perfectly. Highly recommend!',
    privateReview: 'Excellent guest, very clean and quiet.',
    submittedAt: '2024-08-08T10:00:00Z',
    channel: 'airbnb',
    reviewCategory: [
      { category: 'cleanliness', rating: 5 },
      { category: 'communication', rating: 5 },
      { category: 'location', rating: 4 },
      { category: 'value', rating: 5 }
    ],
    isApproved: true,
    isPublic: true,
    response: 'Thank you David! We\'re thrilled you had such a great experience.'
  },
  {
    id: 'rev-5',
    listingName: '2B N5 E - 23 Bethnal Green',
    guestName: 'Lisa Thompson',
    rating: 4,
    publicReview: 'Lovely apartment in a great area. Close to Victoria Park and lots of cafes. The apartment was clean and comfortable.',
    privateReview: 'Good guest, left the place tidy.',
    submittedAt: '2024-08-20T10:00:00Z',
    channel: 'booking.com',
    reviewCategory: [
      { category: 'cleanliness', rating: 4 },
      { category: 'communication', rating: 4 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 4 }
    ],
    isApproved: true,
    isPublic: true,
    response: 'Thanks Lisa! We\'re glad you enjoyed the Bethnal Green area and its proximity to the park.'
  },
  {
    id: 'rev-6',
    listingName: '2B N1 A - 29 Shoreditch Heights',
    guestName: 'James Wilson',
    rating: 4,
    publicReview: 'Great apartment in a fantastic location. The building is modern and the apartment has everything you need.',
    privateReview: 'Good guest, no issues.',
    submittedAt: '2024-07-25T10:00:00Z',
    channel: 'airbnb',
    reviewCategory: [
      { category: 'cleanliness', rating: 4 },
      { category: 'communication', rating: 4 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 4 }
    ],
    isApproved: true,
    isPublic: true,
    response: 'Thank you James! We appreciate your positive feedback.'
  },
  {
    id: 'rev-7',
    listingName: '1B N2 B - 15 Brick Lane',
    guestName: 'Anna Kowalski',
    rating: 5,
    publicReview: 'Amazing stay! The flat was perfect and the location couldn\'t be better. Will definitely book again.',
    privateReview: 'Excellent guest, very respectful.',
    submittedAt: '2024-09-05T10:00:00Z',
    channel: 'booking.com',
    reviewCategory: [
      { category: 'cleanliness', rating: 5 },
      { category: 'communication', rating: 5 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 5 }
    ],
    isApproved: true,
    isPublic: true,
    response: 'Thank you Anna! We can\'t wait to host you again.'
  },
  {
    id: 'rev-8',
    listingName: '3B N3 C - 42 Spitalfields',
    guestName: 'Robert Brown',
    rating: 2,
    publicReview: 'The house was spacious but had several issues. The heating didn\'t work properly and the kitchen appliances were outdated.',
    privateReview: 'Guest had valid complaints. Need to upgrade heating system and kitchen appliances.',
    submittedAt: '2024-08-01T10:00:00Z',
    channel: 'airbnb',
    reviewCategory: [
      { category: 'cleanliness', rating: 3 },
      { category: 'communication', rating: 2 },
      { category: 'location', rating: 4 },
      { category: 'value', rating: 2 }
    ],
    isApproved: false,
    isPublic: false,
    response: 'Thank you for your feedback Robert. We\'ve addressed the heating issues and are upgrading the kitchen appliances.'
  }
]

export const getReviewsByProperty = (propertyId: string): Review[] => {
  const property = mockProperties.find(p => p.id === propertyId)
  if (!property) return []
  
  return mockReviews.filter(review => 
    review.listingName.includes(property.name.split(' - ')[1]) && 
    review.isApproved && 
    review.isPublic
  )
}

export const getApprovedReviews = (): Review[] => {
  return mockReviews.filter(review => review.isApproved && review.isPublic)
}

export const getPendingReviews = (): Review[] => {
  return mockReviews.filter(review => !review.isApproved)
}
