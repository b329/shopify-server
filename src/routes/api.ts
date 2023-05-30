import express, {Request, response, Response} from 'express';
import {LATEST_API_VERSION, shopifyApi, DeliveryMethod } from "@shopify/shopify-api";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {createClient, ClientResponse, GeocodingResult} from '@google/maps';
import {getLocationById, getLocationByName} from "../api/locations/locations.service";
import axios, { AxiosResponse } from 'axios';
import {ILocationArray} from "../api/locations/locations.model";

const router = express.Router();

dotenv.config();
const googleApiKey: string = process.env.GOOGLE_API_KEY || '';
const shopifyAccessToken: string = process.env.SHOPIFY_ACCESS_TOKEN || '';
console.log(googleApiKey)
console.log(shopifyAccessToken)

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
                component.types.includes('administrative_area_level_1')
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

router.get('/in', (req: Request, res: Response) => {
    const jsonData =
        { "rates": [ { "service_name": "cityRange", "service_code": "ON", "total_price": "20000", "description": "This is the fixed fee in a range", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" } ] }
    res.send(jsonData);
});

router.get('/out', (req: Request, res: Response) => {
    const jsonData =
        { "rates": [ { "service_name": "cityOutOfRange", "service_code": "ON", "total_price": "29000", "description": "This is the fixed fee in a range", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" } ] }
    res.send(jsonData);
});

// shopify 의 callbak url 은 post 로만 가능하다.
// city 가 range 범위 안에 있을때
router.post('/in', (req: Request, res: Response) => {
    const jsonData =
        { "rates": [ { "service_name": "cityRange", "service_code": "ON", "total_price": "2000000", "description": "This is the fixed fee in a range", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" } ] }
    res.send(jsonData);
});

// city 가 range 범위 밖에 있을때
router.post('/out', (req: Request, res: Response) => {
    const jsonData =
        { "rates": [ { "service_name": "outOfCityRange", "service_code": "ON", "total_price": "2900000", "description": "This is the fixed fee in a range", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" } ] }
    res.send(jsonData);
});

router.post('/cartCreation',async(req: Request, res: Response) => {

    // the body of the data received
    try {
    const data = req.body;
    console.log(data['billing_address'])
    const shippingAddress = data['billing_address'];
    const address = shippingAddress?.address1;
    const city = shippingAddress?.city;
    const province = shippingAddress?.province;

    const total_price = data['total_price'];
    const sub_total_price = data['subtotal_price'];

    const originCity = 'Ho Chi Minh';
    const streetAddress = '123 Main Street';

        // 거리계산 함수.
        // const city = 'Ha';
        // const address = 'Trường Đại Học Kinh Tế Quốc Dân';
        // const province = '';
        //
        // const distance = await getDistance(originCity, city, address, province);
        // console.log(distance);
        // 도시명만 추출하는 함수.
        const cityName = await getCityFromAddress(city, address, province);
        console.log(cityName);

        const getLocation = await getLocationByName(cityName);
        console.log(getLocation);

        // Shopify API 호출. in/ out 에 따라서 처리.
        // id: 65040482548 값은 변경될 수 있음. 일단 Shopify API 의 기능이 동작하는지 확인하기 위해 빠르게 적용함.

        const apiUrl = 'https://gomicorp.myshopify.com/admin/api/2023-04/carrier_services/65040482548.json';
        const accessToken = shopifyAccessToken;
        const headers = {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        };
        // @ts-ignore
        if (!getLocation ||  getLocation.length === 0) {
            console.log('getLocation is null or empty');
            const requestData = {
                carrier_service: {
                    id: 65040482548,
                    name: 'cityOutOfRange',
                    active: 'On',
                    callback_url: 'https://9a85-218-153-85-41.ngrok-free.app/api/out',
                    service_discovery: true,
                },
            };
            console.log(getLocation)
            // Request 를 getLocation 에 따라서 정해지면 그 내용으로 axios 로 PUT 요청.
            axios
                .put(apiUrl, requestData, { headers })
                .then(() => {
                    // @ts-ignore
                    console.log(requestData.carrier_service.callback_url)
                    console.log('CarrierService 업데이트 성공 is null or empty');

                })
                .catch((error) => {
                    console.error('CarrierService 업데이트 실패');
                    console.error(error.response.data);
                });
        } else {
            console.log('getLocation is in city Range');
            const requestData = {
                carrier_service: {
                    id: 65040482548,
                    name: 'cityRange',
                    active: 'On',
                    callback_url: 'https://9a85-218-153-85-41.ngrok-free.app/api/in',
                    service_discovery: true,
                },
            };
            console.log(getLocation)
            // Request 를 getLocation 에 따라서 정해지면 그 내용으로 axios 로 PUT 요청.
            axios
                .put(apiUrl, requestData, { headers })
                .then(() => {
                    // @ts-ignore
                    console.log(requestData.carrier_service.callback_url)
                    console.log('CarrierService 업데이트 성공 getLocation is in city Range');

                })
                .catch((error) => {
                    console.error('CarrierService 업데이트 실패');
                    console.error(error.response.data);
                });
        }
        res.send(getLocation);
    } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
}
});

export default router;