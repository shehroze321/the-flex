import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { connectDatabase } from '@/utils/database';
import { logger, morganStream } from '@/utils/logger';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import Env from '@/config/env';

// Import routes
import reviewRoutes from '@/routes/reviewRoutes';
import dashboardRoutes from '@/routes/dashboardRoutes';
import propertyRoutes from '@/routes/propertyRoutes';

// Validate environment variables
Env.validate();

const app = express();
const PORT = Env.PORT;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: Env.getCorsOrigins(),
  credentials: true
}));

// Rate limiting (disabled for development)
if (Env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: Env.RATE_LIMIT_WINDOW_MS, // 15 minutes
    max: Env.RATE_LIMIT_MAX_REQUESTS, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    }
  });
  app.use(limiter);
}

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', { stream: morganStream }));

// Body parsing middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Flex Living Reviews API is running',
    timestamp: new Date().toISOString(),
    environment: Env.NODE_ENV
  });
});

// API routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/properties', propertyRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Flex Living Reviews API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      reviews: '/api/reviews',
      dashboard: '/api/dashboard',
      properties: '/api/properties'
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    
    // For Vercel deployment
    if (process.env.NODE_ENV === 'production') {
      // Export the app for Vercel
      module.exports = app;
    } else {
      // Start HTTP server for local development
      app.listen(PORT, () => {
        logger.info(`🚀 Flex Living Reviews API server running on port ${PORT}`);
        logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
        logger.info(`📚 API Documentation: http://localhost:${PORT}/`);
      });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
