import express, { Request, Response } from 'express';
import {LATEST_API_VERSION, shopifyApi} from "@shopify/shopify-api";

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('API is working!');
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