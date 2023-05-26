import { Request, Response, Router } from 'express';
import LocationsRoutes from './locations/locations.routes';

const router = Router();

router.use('/locations', LocationsRoutes);
// router.use('/calculations', CalculationsRoutes);
export default router;
