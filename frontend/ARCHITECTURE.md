# Flex Living Reviews - Architecture Documentation

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── properties/        # Properties listing page
│   ├── property/[id]/     # Individual property details
│   ├── reviews/           # Reviews management page
│   ├── globals.css        # Global styles and theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── PropertyCard.tsx  # Property card component
│   ├── StatsCard.tsx     # Statistics card component
│   ├── PropertyImageGallery.tsx # Image gallery component
│   ├── ReviewCard.tsx    # Review card component
│   └── index.ts          # Component exports
├── config/               # Configuration files
│   └── theme.ts          # Centralized theme configuration
├── data/                 # Static data and mock data
│   ├── properties.ts     # Property data
│   ├── reviews.ts        # Review data
│   └── index.ts          # Data exports
├── hooks/                # Custom React hooks
│   ├── useProperties.ts  # Properties data hook
│   ├── useReviews.ts     # Reviews data hook
│   └── index.ts          # Hook exports
├── lib/                  # Utility functions
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
│   └── index.ts          # Type exports
└── constants/            # Application constants
    └── index.ts          # Constant exports
```

## Architecture Principles

### 1. Component-Based Architecture
- **Reusable Components**: All UI elements are broken down into reusable components
- **Single Responsibility**: Each component has a single, well-defined purpose
- **Composition over Inheritance**: Components are composed together rather than extended

### 2. Centralized State Management
- **Custom Hooks**: Data fetching and state management through custom hooks
- **Separation of Concerns**: Business logic separated from UI components
- **Predictable State Updates**: Clear data flow and state management patterns

### 3. Theme System
- **Centralized Configuration**: All theme values defined in `src/config/theme.ts`
- **CSS Variables**: Theme values exposed as CSS custom properties
- **Consistent Design**: Unified design system across the application

### 4. Data Layer
- **Static Data**: Mock data organized in dedicated data files
- **Type Safety**: All data structures properly typed
- **Future-Ready**: Easy to replace with API calls later

## Key Components

### PropertyCard
- Displays property information in a card format
- Handles image display with fallbacks
- Includes rating and review count
- Clickable navigation to property details

### StatsCard
- Reusable statistics display component
- Supports icons and custom styling
- Used across dashboard and properties pages

### PropertyImageGallery
- Image carousel with navigation controls
- Handles multiple images with fallbacks
- Responsive design with touch support

### ReviewCard
- Displays individual review information
- Shows category ratings and guest details
- Consistent styling across all review displays

## Custom Hooks

### useProperties
- Manages property data fetching
- Provides property lookup functions
- Handles loading and error states

### useReviews
- Manages review data and filtering
- Provides rating calculations
- Supports property-specific reviews

## Theme System

### Configuration
All theme values are centralized in `src/config/theme.ts`:

```typescript
export const theme = {
  colors: { /* Brand colors */ },
  spacing: { /* Spacing scale */ },
  borderRadius: { /* Border radius values */ },
  shadows: { /* Shadow definitions */ },
  animations: { /* Animation settings */ },
  breakpoints: { /* Responsive breakpoints */ },
  typography: { /* Font settings */ }
}
```

### Usage
Theme values are used throughout the application:

```typescript
// In components
<div className="bg-primary text-primary-foreground">
  Content
</div>

// In CSS
.custom-class {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

## Data Management

### Static Data
- **Properties**: Mock property data in `src/data/properties.ts`
- **Reviews**: Mock review data in `src/data/reviews.ts`
- **Type Safety**: All data properly typed with TypeScript interfaces

### Future API Integration
The current architecture is designed to easily integrate with a backend API:

1. Replace mock data in hooks with API calls
2. Add error handling and loading states
3. Implement caching and optimization
4. Add real-time updates

## Best Practices

### 1. Component Design
- Keep components small and focused
- Use TypeScript for type safety
- Implement proper prop interfaces
- Handle loading and error states

### 2. State Management
- Use custom hooks for complex state logic
- Keep state as close to where it's used as possible
- Implement proper error boundaries

### 3. Styling
- Use the centralized theme system
- Prefer Tailwind CSS classes
- Implement responsive design
- Use CSS custom properties for dynamic values

### 4. Performance
- Implement proper loading states
- Use React.memo for expensive components
- Optimize images and assets
- Implement proper error boundaries

## Development Guidelines

### Adding New Components
1. Create component file in appropriate directory
2. Define TypeScript interfaces for props
3. Implement component with proper styling
4. Export from `src/components/index.ts`
5. Add to relevant pages

### Adding New Data
1. Create data file in `src/data/`
2. Define TypeScript interfaces
3. Create custom hook if needed
4. Export from `src/data/index.ts`

### Modifying Theme
1. Update values in `src/config/theme.ts`
2. Update CSS variables in `globals.css`
3. Test across all components
4. Update documentation

## Future Enhancements

### Backend Integration
- Replace mock data with API calls
- Implement real-time updates
- Add authentication and authorization
- Implement caching strategies

### Advanced Features
- Real-time notifications
- Advanced filtering and search
- Data visualization and analytics
- Mobile app integration

### Performance Optimizations
- Server-side rendering
- Image optimization
- Code splitting
- Caching strategies
