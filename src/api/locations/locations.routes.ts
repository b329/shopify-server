import { Router, } from 'express';
import * as Controller from './locations.controller';

const router = Router();

router
    .route('/')
    .get(
        Controller.getLocations
    );

router
    .route('/:id')
    .get(
        Controller.getLocationById
    );

router
    .route('/')
    .post(
        Controller.addLocation
    );

router
    .route('/:id')
    .patch(
        Controller.updateLocationById
    );

router
    .route('/:id')
    .delete(
        Controller.deleteLocationById
    );

export default router;