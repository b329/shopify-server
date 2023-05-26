import { execute } from "./../utils/mysql.connector";

import { LocationQueries } from "./locations.queries";
import { ILocation } from "./locations.model";

/**
 * gets active locations
 */
export const getLocations = async () => {
    return execute<ILocation[]>(LocationQueries.GetLocations, []);
};

/**
 * gets a team based on id provided
 */
export const getLocationById = async (id: ILocation['id']) => {
    return execute<ILocation>(LocationQueries.GetLocationsById, [id]);
};

export const getLocationByName = async (name: ILocation['region']) => {
    return execute<ILocation>(LocationQueries.GetLocationsByName, [name]);
};

/**
 * adds a new active team record
 */
export const insertLocation = async (location: ILocation) => {
    const result = await execute<{ affectedRows: number }>(LocationQueries.AddLocation, [
        location.region,
        location.location,
        location.fee,
    ]);
    return result.affectedRows > 0;
};

/**
 * updates team information based on the id provided
 */
export const updateLocation = async (location: ILocation) => {
    const result = await execute<{ affectedRows: number }>(LocationQueries.UpdateLocationById, [
        location.region,
        location.location,
        location.fee,
        location.id
    ]);
    return result.affectedRows > 0;
};

/**
 * updates team information based on the id provided
 */
export const deleteLocation = async (id: ILocation['id']) => {
    const result = await execute<{ affectedRows: number }>(LocationQueries.DeleteLocationById, [
        id
    ]);
    return result.affectedRows > 0;
};