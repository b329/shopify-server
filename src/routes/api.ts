import express, { Request, Response } from 'express';
import {LATEST_API_VERSION, shopifyApi, DeliveryMethod } from "@shopify/shopify-api";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createClient, ClientResponse }from '@google/maps';
const router = express.Router();

dotenv.config();
const googleApiKey: string = process.env.GOOGLE_API_KEY || '';

const googleMapsClient = createClient({
    key: googleApiKey,
    Promise: Promise
});

async function getDistance(originCity: string, city: string, streetAddress: string, province: string): Promise<string> {
    try {
        const fullAddress = `${streetAddress}, ${city}, ${province}`;

        const geocodeResponse: ClientResponse<any> = await googleMapsClient.geocode({ address: fullAddress }).asPromise();
        const results = geocodeResponse.json.results;

        if (results.length > 0) {
            const targetLocation = results[0].geometry.location;
            const targetPlaceId = results[0].place_id;

            const distanceResponse: ClientResponse<any> = await googleMapsClient.distanceMatrix({
                origins: [originCity],
                destinations: ['place_id:' + targetPlaceId],
            }).asPromise();

            const distance = distanceResponse.json.rows[0].elements[0].distance.text;
            return distance;
        } else {
            throw new Error('No results found for the given address.');
        }
    } catch (error) {
        throw new Error('Error geocoding the address: ' + JSON.stringify(error));
    }
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

// shopify 의 callbak url 은 post 로만 가능하다.
router.post('/', (req: Request, res: Response) => {
    const jsonData =
        { "rates": [ { "service_name": "canadapost-overnight", "service_code": "ON", "total_price": "1295", "description": "This is the fastest option by far", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" }, { "service_name": "fedex-2dayground", "service_code": "2D", "total_price": "2934", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" }, { "service_name": "fedex-priorityovernight", "service_code": "1D", "total_price": "3587", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" } ] }
    res.send(jsonData);
});

router.post('/cartCreation',async(req: Request, res: Response) => {

    // the body of the data received
    const data = req.body;
    // console.log(data['shipping_address'])
    const shippingAddress = data['shipping_address'];
    const address = shippingAddress['address1'];
    const city =shippingAddress['city'];
    const province = shippingAddress['province'];

    const originCity = 'New York, NY';
    // const streetAddress = '123 Main Street';

    try {
        const distance = await getDistance(originCity, city, address, province);
        console.log(distance);

        res.send(data);
    } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
}
});

export default router;