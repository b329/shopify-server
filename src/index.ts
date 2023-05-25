import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
// import { generateToken } from './api/utils/jwt.utils';
import * as path from 'path';
// import logger from './api/middlewares/logger.middleware';
// import errorHandler from './api/middlewares/error-handler.middleware';
import * as MySQLConnector from './api/utils/mysql.connector';
import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';
import apiRouter from './routes/api';
// import {logger} from "sequelize/types/utils/logger";
const app = express();
const port = 8000;

// Only generate a token for lower level environments
// if (process.env.NODE_ENV !== 'production') {
//     console.log('JWT', generateToken());
// }

// create database pool
MySQLConnector.init();

// serve static files
app.use(express.static(path.join(__dirname, '../public')));

// compresses all the responses
// app.use(compression());

// adding set of security middlewares
app.use(helmet());

// parse incoming request body and append data to `req.body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable all CORS request
app.use(cors());

// add logger middleware
// app.use(logger);


app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});