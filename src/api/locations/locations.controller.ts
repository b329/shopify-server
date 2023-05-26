import { Request, RequestHandler, Response } from 'express';
import {
    IGetLocationReq,
    IAddLocationReq,
    IUpdateLocationReq,
    IDeleteLocationReq
} from './locations.model';
import * as LocationService from './locations.service';

/**
 * Get active location records
 *
 * @param req Express Request
 * @param res Express Response
 */
export const getLocations: RequestHandler = async (req: Request, res: Response) => {
    try {
        const teams = await LocationService.getLocations();

        res.status(200).json({
            teams
        });
    } catch (error) {
        console.error('[locations.controller][getLocations][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching locations'
        });
    }
};

/**
 * Get location record based on id provided
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const getLocationById: RequestHandler = async (req: IGetLocationReq, res: Response) => {
    try {
        const location = await LocationService.getLocationById(req.params.id);

        res.status(200).json({
            location
        });
    } catch (error) {
        console.error('[locations.controller][getLocationById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching team'
        });
    }
};

/**
 * Inserts a new location record based
 *
 * @param req Express Request
 * @param res Express Response
 */
export const addLocation: RequestHandler = async (req: IAddLocationReq, res: Response) => {
    try {
        const result = await LocationService.insertLocation(req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[locations.controller][addLocation][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding new team'
        });
    }
};

/**
 * Updates existing location record
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const updateLocationById: RequestHandler = async (req: IUpdateLocationReq, res: Response) => {
    try {
        const result = await LocationService.updateLocation({ ...req.body, id: req.params.id });

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[locations.controller][updateLocationById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating team'
        });
    }
};

/**
 * deletes a location
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const deleteLocationById: RequestHandler = async (req: IDeleteLocationReq, res: Response) => {
    try {
        const result = await LocationService.deleteLocation(req.params.id);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[locations.controller][deleteLocationById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting team'
        });
    }
};