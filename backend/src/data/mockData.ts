import { Review, Property } from '@/types';

export const mockReviews: Review[] = [
  {
    id: '1',
    propertyId: 'property-1',
    type: 'guest-to-host',
    status: 'published',
    rating: 5,
    publicReview: 'Amazing stay! The property was exactly as described and the location was perfect.',
    reviewCategory: [
      { category: 'cleanliness', rating: 5 },
      { category: 'communication', rating: 5 },
      { category: 'check_in', rating: 5 },
      { category: 'accuracy', rating: 5 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 5 }
    ],
    submittedAt: '2024-01-15T10:30:00Z',
    guestName: 'Sarah Johnson',
    listingName: 'Modern Downtown Apartment',
    channel: 'airbnb',
    isApproved: true,
    isPublic: true,
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    propertyId: 'property-1',
    type: 'guest-to-host',
    status: 'published',
    rating: 4,
    publicReview: 'Great location and clean apartment. The host was very responsive.',
    reviewCategory: [
      { category: 'cleanliness', rating: 4 },
      { category: 'communication', rating: 5 },
      { category: 'check_in', rating: 4 },
      { category: 'accuracy', rating: 4 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 4 }
    ],
    submittedAt: '2024-01-10T14:20:00Z',
    guestName: 'Mike Chen',
    listingName: 'Modern Downtown Apartment',
    channel: 'booking',
    isApproved: true,
    isPublic: true,
    response: 'Thank you for your feedback! We\'re glad you enjoyed your stay.',
    createdAt: new Date('2024-01-10T14:20:00Z'),
    updatedAt: new Date('2024-01-10T14:20:00Z')
  },
  {
    id: '3',
    propertyId: 'property-2',
    type: 'guest-to-host',
    status: 'published',
    rating: 3,
    publicReview: 'The property was okay but could use some improvements in cleanliness.',
    reviewCategory: [
      { category: 'cleanliness', rating: 2 },
      { category: 'communication', rating: 4 },
      { category: 'check_in', rating: 3 },
      { category: 'accuracy', rating: 3 },
      { category: 'location', rating: 4 },
      { category: 'value', rating: 3 }
    ],
    submittedAt: '2024-01-08T09:15:00Z',
    guestName: 'Emma Wilson',
    listingName: 'Cozy Studio in Historic District',
    channel: 'direct',
    isApproved: false,
    isPublic: false,
    createdAt: new Date('2024-01-08T09:15:00Z'),
    updatedAt: new Date('2024-01-08T09:15:00Z')
  },
  {
    id: '4',
    propertyId: 'property-2',
    type: 'guest-to-host',
    status: 'published',
    rating: 5,
    publicReview: 'Perfect location and beautiful property. Highly recommended!',
    reviewCategory: [
      { category: 'cleanliness', rating: 5 },
      { category: 'communication', rating: 5 },
      { category: 'check_in', rating: 5 },
      { category: 'accuracy', rating: 5 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 5 }
    ],
    submittedAt: '2024-01-05T16:45:00Z',
    guestName: 'David Rodriguez',
    listingName: 'Cozy Studio in Historic District',
    channel: 'airbnb',
    isApproved: true,
    isPublic: true,
    createdAt: new Date('2024-01-05T16:45:00Z'),
    updatedAt: new Date('2024-01-05T16:45:00Z')
  },
  {
    id: '5',
    propertyId: 'property-1',
    type: 'guest-to-host',
    status: 'published',
    rating: 5,
    publicReview: 'Absolutely perfect! The host was amazing and the place was spotless.',
    reviewCategory: [
      { category: 'cleanliness', rating: 5 },
      { category: 'communication', rating: 5 },
      { category: 'check_in', rating: 5 },
      { category: 'accuracy', rating: 5 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 5 }
    ],
    submittedAt: '2024-01-20T16:45:00Z',
    guestName: 'David Kim',
    listingName: 'Modern Downtown Apartment',
    channel: 'airbnb',
    isApproved: true,
    isPublic: true,
    createdAt: new Date('2024-01-20T16:45:00Z'),
    updatedAt: new Date('2024-01-20T16:45:00Z')
  },
  {
    id: '6',
    propertyId: 'property-2',
    type: 'guest-to-host',
    status: 'published',
    rating: 4,
    publicReview: 'Great beach house with amazing views. Would definitely stay again!',
    reviewCategory: [
      { category: 'cleanliness', rating: 4 },
      { category: 'communication', rating: 4 },
      { category: 'check_in', rating: 5 },
      { category: 'accuracy', rating: 4 },
      { category: 'location', rating: 5 },
      { category: 'value', rating: 4 }
    ],
    submittedAt: '2024-01-18T11:30:00Z',
    guestName: 'Lisa Wang',
    listingName: 'Cozy Beach House',
    channel: 'booking',
    isApproved: true,
    isPublic: true,
    createdAt: new Date('2024-01-18T11:30:00Z'),
    updatedAt: new Date('2024-01-18T11:30:00Z')
  }
];

export const mockProperties: Property[] = [
  {
    id: 'property-1',
    name: 'Modern Downtown Apartment',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    description: 'A beautiful modern apartment in the heart of downtown with stunning city views.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    features: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      guests: 4
    },
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Kitchen',
      'Washer',
      'Dryer',
      'Parking',
      'Gym',
      'Pool'
    ],
    pricePerNight: 150,
    isActive: true,
    averageRating: 4.5,
    totalReviews: 2,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'property-2',
    name: 'Cozy Studio in Historic District',
    address: '456 Heritage Lane',
    city: 'Boston',
    country: 'USA',
    description: 'A charming studio apartment in the historic district with original architectural details.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800'
    ],
    features: {
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      guests: 2
    },
    amenities: [
      'WiFi',
      'Heating',
      'Kitchenette',
      'TV',
      'Parking'
    ],
    pricePerNight: 120,
    isActive: true,
    averageRating: 4.0,
    totalReviews: 2,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-08T09:15:00Z')
  }
];
