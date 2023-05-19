import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';

const shopify = shopifyApi({
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false,
    restResources: undefined,
    // The next 4 values are typically read from environment variables for added security
    // If you don't have apiKey, will get Error: Cannot initialize Shopify API Library. Missing values for: apiKey
    apiKey: '9e52c4a632f53c358aba0a8363519551',
    apiSecretKey: 'fe1fc79b069234d7b19c0edecc2c802e',
    scopes: ['read_products'],
    hostName: 'https://9cd1-218-153-85-41.ngrok-free.app'
});

console.log(shopify);

const app = express();