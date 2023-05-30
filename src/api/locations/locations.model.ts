import { Request } from 'express';

export interface ILocation {
    id: number;
    region: string;
    location: string;
    fee: number,
    isActive: boolean
};

export type IGetLocationReq = Request<{ id: ILocation['id'] }>;
export type IAddLocationReq = Request<NonNullable<unknown>>;
export type IUpdateLocationReq = Request<{ id: ILocation['id'] }, any, ILocation>;
export type IDeleteLocationReq = Request<{ id: ILocation['id'] }>;
export type ILocationArray = ILocation[];