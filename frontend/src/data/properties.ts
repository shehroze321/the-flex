import { Property } from '@/types'

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: '2B N1 A - 29 Shoreditch Heights',
    address: '29 Shoreditch Heights, London E1 6JQ',
    city: 'London',
    country: 'UK',
    description: 'A beautifully furnished 2-bedroom apartment in the heart of Shoreditch, perfect for professionals. Enjoy modern amenities and easy access to public transport.',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
    ],
    features: {
      bedrooms: 2,
      bathrooms: 1,
      sqft: 850,
      guests: 4,
    },
    amenities: [
      'Free WiFi', 'Parking', 'Fully Equipped Kitchen', '24/7 Security',
      'Smart TV', 'Air Conditioning', 'Heating', 'Washing Machine',
      'Dishwasher', 'Coffee Maker', 'Hair Dryer', 'Iron',
    ],
    pricePerNight: 120,
    availability: 'Available',
    totalReviews: 8,
    averageRating: 4.2,
    isActive: true,
    lastReviewDate: '2024-08-10T10:00:00Z'
  },
  {
    id: 'prop-2',
    name: '1B N2 B - 15 Brick Lane',
    address: '15 Brick Lane, London E1 6PU',
    city: 'London',
    country: 'UK',
    description: 'Charming 1-bedroom flat on the vibrant Brick Lane. Ideal for short to medium stays, offering a blend of comfort and city life.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
    ],
    features: {
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      guests: 2,
    },
    amenities: [
      'Free WiFi', 'Fully Equipped Kitchen', 'Smart TV', 'Heating',
      'Washing Machine', 'Coffee Maker', 'Iron',
    ],
    pricePerNight: 90,
    availability: 'Available',
    totalReviews: 15,
    averageRating: 4.5,
    isActive: true,
    lastReviewDate: '2024-09-10T10:00:00Z'
  },
  {
    id: 'prop-3',
    name: '3B N3 C - 42 Spitalfields',
    address: '42 Spitalfields, London E1 6DY',
    city: 'London',
    country: 'UK',
    description: 'Spacious 3-bedroom house in the historic Spitalfields area. Perfect for families or larger groups, with ample living space and modern comforts.',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
    ],
    features: {
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1200,
      guests: 6,
    },
    amenities: [
      'Free WiFi', 'Parking', 'Fully Equipped Kitchen', '24/7 Security',
      'Smart TV', 'Air Conditioning', 'Heating', 'Washing Machine',
      'Dishwasher', 'Coffee Maker', 'Hair Dryer', 'Iron', 'Garden',
    ],
    pricePerNight: 180,
    availability: 'Available',
    totalReviews: 12,
    averageRating: 3.8,
    isActive: true,
    lastReviewDate: '2024-08-15T10:00:00Z'
  },
  {
    id: 'prop-4',
    name: 'Studio N4 D - 8 Whitechapel',
    address: '8 Whitechapel, London E1 7RA',
    city: 'London',
    country: 'UK',
    description: 'Modern studio apartment in Whitechapel, offering a compact yet comfortable living space for solo travelers or couples.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
    ],
    features: {
      bedrooms: 0,
      bathrooms: 1,
      sqft: 400,
      guests: 1,
    },
    amenities: [
      'Free WiFi', 'Kitchenette', 'Smart TV', 'Heating',
      'Coffee Maker', 'Iron',
    ],
    pricePerNight: 70,
    availability: 'Available',
    totalReviews: 8,
    averageRating: 4.7,
    isActive: true,
    lastReviewDate: '2024-08-08T10:00:00Z'
  },
  {
    id: 'prop-5',
    name: '2B N5 E - 23 Bethnal Green',
    address: '23 Bethnal Green, London E2 6DG',
    city: 'London',
    country: 'UK',
    description: 'Stylish 2-bedroom apartment in the lively Bethnal Green. Close to markets and parks, offering a great local experience.',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
    ],
    features: {
      bedrooms: 2,
      bathrooms: 1,
      sqft: 750,
      guests: 3,
    },
    amenities: [
      'Free WiFi', 'Fully Equipped Kitchen', 'Smart TV', 'Heating',
      'Washing Machine', 'Dishwasher', 'Coffee Maker', 'Iron',
    ],
    pricePerNight: 110,
    availability: 'Available',
    totalReviews: 6,
    averageRating: 4.0,
    isActive: true,
    lastReviewDate: '2024-08-20T10:00:00Z'
  }
]
