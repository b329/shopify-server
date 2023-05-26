import express, {Request, response, Response} from 'express';
import {LATEST_API_VERSION, shopifyApi, DeliveryMethod } from "@shopify/shopify-api";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {createClient, ClientResponse, GeocodingResult} from '@google/maps';
import {getLocationById, getLocationByName} from "../api/locations/locations.service";
const router = express.Router();

dotenv.config();
const googleApiKey: string = process.env.GOOGLE_API_KEY || '';
console.log(googleApiKey)

const googleMapsClient = createClient({
    key: googleApiKey,
    Promise: Promise
});

async function getDistance(originCity: string, city: string, streetAddress: string, province: string): Promise<string> {
    try {
        const fullAddressParts = [streetAddress, city, province].filter((value) => value !== null);
        const fullAddress = fullAddressParts.join(', ');

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

async function getCityFromAddress(city: string, streetAddress: string, province: string): Promise<string | null> {
    try {
        const fullAddressParts = [streetAddress, city, province].filter((value) => value !== null);
        const fullAddress = fullAddressParts.join(', ');

        const geocodeResponse: ClientResponse<any> = await googleMapsClient.geocode({ address: fullAddress }).asPromise();
        const results = geocodeResponse.json.results;

        if (results.length > 0) {
            const targetCity = results[0].address_components.find((component:any) =>
                component.types.includes('locality')
            );
            if (targetCity) {
                return targetCity.long_name;
            }
        }
    } catch (error) {
        console.error('Error geocoding the address:', error);
    }

    return null;
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

router.get('/', (req: Request, res: Response) => {
    const jsonData =
        { "rates": [ { "service_name": "canadapost-overnight", "service_code": "ON", "total_price": "1295", "description": "This is the fastest option by far", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" }, { "service_name": "fedex-2dayground", "service_code": "2D", "total_price": "2934", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" }, { "service_name": "fedex-priorityovernight", "service_code": "1D", "total_price": "3587", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" } ] }
    res.send(jsonData);
});

// shopify 의 callbak url 은 post 로만 가능하다.
router.post('/', (req: Request, res: Response) => {
    const jsonData =
        { "rates": [ { "service_name": "canadapost-overnight", "service_code": "ON", "total_price": "1295", "description": "This is the fastest option by far", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" }, { "service_name": "fedex-2dayground", "service_code": "2D", "total_price": "2934", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" }, { "service_name": "fedex-priorityovernight", "service_code": "1D", "total_price": "3587", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" } ] }
    res.send(jsonData);
});

router.post('/cartCreation',async(req: Request, res: Response) => {

    // the body of the data received
    const data = req.body;
    console.log(data['billing_address'])
    const shippingAddress = data['billing_address'];
    const address = shippingAddress['address1'];
    const city =shippingAddress['city'];
    const province = shippingAddress['province'];

    const total_price = data['total_price'];
    const sub_total_price = data['subtotal_price'];

    const originCity = 'Ho Chi Minh';
    const streetAddress = '123 Main Street';

    try {
        // 거리계산 함수.
        // const city = 'Ha';
        // const address = 'Trường Đại Học Kinh Tế Quốc Dân';
        // const province = '';

        // const distance = await getDistance(originCity, city, address, province);
        // console.log(distance);
        // 도시명만 추출하는 함수.
        // const cityName = await getCityFromAddress(city, address, province);
        // console.log(cityName);

        const getLocation = await getLocationByName('Hanoi');
        console.log(getLocation);
        if (!getLocation) {
            // getLocation 배열이 비어 있는 경우
            // 처리할 내용 작성
            console.log(getLocation)
        } else {
            // getLocation 배열에 결과가 있는 경우
            // 처리할 내용 작성
            console.log(getLocation)
        }

        res.send(getLocation);
    } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
}
});

export default router;