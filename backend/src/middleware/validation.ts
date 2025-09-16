import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiResponse } from '@/types';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const response: ApiResponse = {
          success: false,
          error: 'Validation error',
          message: error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
        };
        res.status(400).json(response);
        return;
      }
      next(error);
    }
  };
};

// Common validation schemas
export const reviewApprovalSchema = z.object({
  body: z.object({
    isApproved: z.boolean(),
    isPublic: z.boolean().optional()
  })
});

export const bulkApprovalSchema = z.object({
  body: z.object({
    reviewIds: z.array(z.string()).min(1),
    isApproved: z.boolean(),
    isPublic: z.boolean().optional()
  })
});

export const reviewResponseSchema = z.object({
  body: z.object({
    response: z.string().min(1).max(1000)
  })
});

export const propertySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    address: z.string().min(1).max(500),
    city: z.string().min(1).max(100),
    country: z.string().min(1).max(100),
    imageUrl: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    description: z.string().max(2000).optional(),
    features: z.object({
      bedrooms: z.number().min(0).optional(),
      bathrooms: z.number().min(0).optional(),
      sqft: z.number().min(0).optional(),
      guests: z.number().min(1).optional()
    }).optional(),
    amenities: z.array(z.string()).optional(),
    pricePerNight: z.number().min(0).optional(),
    availability: z.string().optional(),
    isActive: z.boolean().optional()
  })
});
