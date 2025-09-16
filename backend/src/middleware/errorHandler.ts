import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { ApiResponse } from '@/types';
import Env from '@/config/env';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Unhandled error:', error);

  const response: ApiResponse = {
    success: false,
    error: Env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    message: 'An unexpected error occurred'
  };

  res.status(500).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  };

  res.status(404).json(response);
};
