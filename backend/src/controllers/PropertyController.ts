import { Request, Response } from 'express';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';
import { mockProperties } from '@/data/mockData';

export class PropertyController {
  /**
   * GET /api/properties
   * Get all properties
   */
  getProperties = async (_req: Request, res: Response): Promise<void> => {
    try {
      const response: ApiResponse = {
        success: true,
        data: mockProperties
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in getProperties controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * GET /api/properties/:id
   * Get property by ID
   */
  getPropertyById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Property ID is required'
        };
        res.status(400).json(response);
        return;
      }

      const property = mockProperties.find(p => p.id === id);

      if (!property) {
        const response: ApiResponse = {
          success: false,
          error: 'Property not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: property
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in getPropertyById controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };
}