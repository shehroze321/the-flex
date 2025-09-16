import { Router } from 'express';
import { PropertyController } from '@/controllers/PropertyController';

const router = Router();
const propertyController = new PropertyController();

// GET /api/properties
router.get('/', propertyController.getProperties);

// GET /api/properties/:id
router.get('/:id', propertyController.getPropertyById);

export default router;