# Flex Living Reviews Dashboard - Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

### 2. Installation

```bash
# Navigate to project directory
cd flex-living-reviews

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application
Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Environment Setup

### 1. No Environment Setup Required! 🎉
This version uses dummy data, so no API keys or environment variables are needed. The application runs immediately with realistic sample data.

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Development with Turbopack (faster)
npm run dev -- --turbo
```

## Project Structure

```
flex-living-reviews/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── properties/     # Properties page
│   │   ├── property/[id]/  # Individual property page
│   │   └── reviews/        # Reviews management page
│   ├── components/         # React components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript types
│   └── constants/         # App constants
├── public/                # Static assets
├── README.md             # Project documentation
├── TECHNICAL_DOCS.md     # Technical documentation
└── SETUP.md              # This file
```

## Features Overview

### ✅ Implemented Features

1. **Dashboard**
   - Overview metrics and statistics
   - Top performing properties
   - Recent reviews
   - Issues to address
   - Rating distribution

2. **Review Management**
   - Filter by rating, category, channel, status
   - Search functionality
   - Bulk approve/reject actions
   - Review approval workflow

3. **Property Management**
   - Property portfolio view
   - Individual property pages
   - Performance metrics
   - Review display

4. **API Integration**
   - Hostaway API (mocked with realistic data)
   - Google Reviews API (optional)
   - RESTful API design

5. **UI/UX**
   - Responsive design
   - Modern, clean interface
   - Mobile-first approach
   - Accessibility features

## API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard overview

### Reviews
- `GET /api/reviews` - Get filtered reviews
- `PATCH /api/reviews` - Bulk update reviews
- `GET /api/reviews/hostaway` - Get Hostaway reviews
- `GET /api/reviews/google` - Get Google Reviews

## Data Sources

### Mock Data
The application uses realistic mock data for demonstration:
- 50+ sample reviews across 5 properties
- Various channels (Airbnb, Booking.com, Hostaway, Google, Direct)
- Different ratings and categories
- Realistic review content and dates

### Real API Integration
- **Hostaway API**: Configured with provided credentials
- **Google Places API**: Optional integration for Google Reviews

## Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update `src/constants/index.ts` for color schemes
- Customize components in `src/components/ui/`

### Data
- Update mock data in `src/lib/utils.ts`
- Modify API responses in `src/app/api/`
- Add new properties in dashboard API

### Features
- Add new pages in `src/app/`
- Create new components in `src/components/`
- Extend types in `src/types/index.ts`

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Or use different port
   npm run dev -- --port 3001
   ```

2. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

3. **TypeScript Errors**
   ```bash
   # Check TypeScript
   npx tsc --noEmit
   ```

4. **Dependency Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Performance Issues

1. **Slow Development**
   - Use Turbopack: `npm run dev -- --turbo`
   - Check for large dependencies
   - Optimize imports

2. **Build Size**
   - Analyze bundle: `npm run build && npx @next/bundle-analyzer`
   - Remove unused dependencies
   - Optimize images

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Other Platforms
- **Netlify**: Static site generation
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## Development Tips

1. **Hot Reload**: Changes reflect immediately in development
2. **TypeScript**: Use strict typing for better code quality
3. **Components**: Reuse shadcn/ui components for consistency
4. **API**: Test endpoints with Postman or browser
5. **Responsive**: Test on different screen sizes

## Support

For issues or questions:
1. Check this setup guide
2. Review technical documentation
3. Check GitHub issues
4. Contact development team

---

**Happy coding! 🚀**
