import http from 'http';
import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';
import apiRouter from './routes/api';
const app = express();
const port = 8000;

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});