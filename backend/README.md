# Flex Living Reviews Backend API

A comprehensive Node.js TypeScript backend API for the Flex Living Reviews Dashboard, featuring Hostaway integration, Google Reviews API, and MongoDB database.

## 🚀 Features

### Core Functionality
- **Hostaway Integration**: Fetch and normalize reviews from Hostaway API
- **Google Reviews Integration**: Fetch reviews from Google Places API
- **Review Management**: CRUD operations for reviews with approval workflow
- **Property Management**: CRUD operations for properties
- **Dashboard Analytics**: Comprehensive statistics and insights
- **Real-time Sync**: Automatic data synchronization and statistics updates

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **MongoDB**: Document-based database with Mongoose ODM
- **Express.js**: RESTful API with proper middleware
- **Rate Limiting**: Built-in rate limiting and security
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Centralized error handling and validation
- **API Documentation**: Self-documenting API endpoints

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **External APIs**: Hostaway API, Google Places API
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Zod

## 📁 Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── DashboardController.ts
│   ├── PropertyController.ts
│   └── ReviewController.ts
├── middleware/           # Express middleware
│   ├── errorHandler.ts
│   └── validation.ts
├── models/              # MongoDB models
│   ├── Property.ts
│   └── Review.ts
├── routes/              # API routes
│   ├── dashboardRoutes.ts
│   ├── propertyRoutes.ts
│   └── reviewRoutes.ts
├── services/            # Business logic
│   ├── GoogleReviewsService.ts
│   ├── HostawayService.ts
│   └── ReviewService.ts
├── types/               # TypeScript definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── database.ts
│   └── logger.ts
└── server.ts            # Main server file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Hostaway API credentials
- Google Places API key (optional)

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd the-flex-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/flex-living-reviews
   
   # Hostaway API Configuration
   HOSTAWAY_ACCOUNT_ID=61148
   HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
   
   # Google Places API Configuration (optional)
   GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Verify the API is running**
   ```bash
   curl http://localhost:3001/health
   ```

## 📚 API Endpoints

### Health Check
- `GET /health` - API health status

### Reviews
- `GET /api/reviews` - Get reviews with filtering and pagination
- `GET /api/reviews/:id` - Get review by ID
- `PATCH /api/reviews/:id/approval` - Update review approval status
- `PATCH /api/reviews/bulk-approval` - Bulk update review approvals
- `POST /api/reviews/:id/response` - Add response to review
- `GET /api/reviews/stats` - Get review statistics
- `GET /api/reviews/hostaway` - Fetch reviews from Hostaway API
- `GET /api/reviews/google` - Fetch reviews from Google Places API
- `POST /api/reviews/google/sync-all` - Sync Google reviews for all properties

### Properties
- `GET /api/properties` - Get properties with filtering and pagination
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property (soft delete)

### Dashboard
- `GET /api/dashboard` - Get dashboard data and analytics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3001 | No |
| `NODE_ENV` | Environment | development | No |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/flex-living-reviews | Yes |
| `HOSTAWAY_ACCOUNT_ID` | Hostaway account ID | 61148 | Yes |
| `HOSTAWAY_API_KEY` | Hostaway API key | Provided | Yes |
| `GOOGLE_PLACES_API_KEY` | Google Places API key | - | No |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:3000 | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 | No |
| `LOG_LEVEL` | Logging level | info | No |

### MongoDB Setup

The API automatically creates the necessary collections and indexes. No manual setup required.

## 🔌 API Integration

### Hostaway API
The backend integrates with Hostaway API to fetch reviews:
- Automatic data normalization
- Property creation and linking
- Review categorization and rating processing
- Error handling and retry logic

### Google Places API
Optional integration for Google Reviews:
- Place search by property name
- Review fetching and normalization
- Category rating generation
- Error handling for API failures

## 📊 Data Models

### Review Model
```typescript
{
  id: string;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'pending' | 'rejected';
  rating: number | null;
  publicReview: string;
  privateReview?: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  listingId?: string;
  channel: 'airbnb' | 'booking' | 'hostaway' | 'google' | 'direct';
  isApproved: boolean;
  isPublic: boolean;
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Property Model
```typescript
{
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  imageUrl?: string;
  images?: string[];
  description?: string;
  features?: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    guests: number;
  };
  amenities?: string[];
  pricePerNight?: number;
  availability?: string;
  totalReviews: number;
  averageRating: number;
  isActive: boolean;
  lastReviewDate?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### Environment Setup
1. Set production environment variables
2. Configure MongoDB Atlas or production MongoDB
3. Set up proper CORS origins
4. Configure rate limiting for production load
5. Set up monitoring and logging

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Zod schema validation
- **Error Handling**: Secure error responses
- **Logging**: Comprehensive audit trail

## 📈 Monitoring and Logging

### Logging
- Winston-based logging system
- File and console logging
- Error tracking and monitoring
- Request/response logging

### Health Checks
- `/health` endpoint for monitoring
- Database connection status
- External API status checks

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Unit tests for services
- Integration tests for API endpoints
- Database operation tests
- External API mocking

## 🔧 Development

### Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm start` - Production server
- `npm run lint` - ESLint checking
- `npm run lint:fix` - ESLint auto-fix

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Git hooks for quality checks

## 📞 Support

For technical support or questions:
- Check the API documentation at `http://localhost:3001/`
- Review the logs in the `logs/` directory
- Check the health endpoint: `http://localhost:3001/health`

## 📄 License

This project is proprietary software for Flex Living.

---

**Built with ❤️ for Flex Living**
