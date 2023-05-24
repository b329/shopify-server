import express, { Request, Response } from 'express';
import {LATEST_API_VERSION, shopifyApi} from "@shopify/shopify-api";

const router = express.Router();

// shopify 의 callbak url 은 post 로만 가능하다.
router.post('/', (req: Request, res: Response) => {
    const jsonData =
        { "rates": [ { "service_name": "canadapost-overnight", "service_code": "ON", "total_price": "1295", "description": "This is the fastest option by far", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" }, { "service_name": "fedex-2dayground", "service_code": "2D", "total_price": "2934", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" }, { "service_name": "fedex-priorityovernight", "service_code": "1D", "total_price": "3587", "currency": "VND", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2024-04-12 14:48:45 -0400" } ] }
    res.send(jsonData);
});

router.get('/users', (req: Request, res: Response) => {
    const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' },
    ];

    res.json(users);
});

router.get('/shopifyAuth', (req: Request, res: Response) => {

    const shopify = shopifyApi({
        apiVersion: LATEST_API_VERSION,
        isEmbeddedApp: false,
        restResources: undefined,
        // The next 4 values are typically read from environment variables for added security
        apiKey: '9e52c4a632f53c358aba0a8363519551',
        apiSecretKey: 'fe1fc79b069234d7b19c0edecc2c802e',
        scopes: ['read_products'],
        hostName: 'https://9cd1-218-153-85-41.ngrok-free.app'
    });

    console.log(shopify);
    res.json(shopify);
});

router.post('/users', (req: Request, res: Response) => {
    const { name } = req.body;

    // 이 부분에서 데이터베이스에 사용자를 추가하거나 다른 작업을 수행할 수 있습니다.

    res.send(`User ${name} created!`);
});

export default router;