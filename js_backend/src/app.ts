import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';

interface HealthResponse {
	version: string;
	serverStart: Date;
	uptime: number;
}

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const version = `1`;
const serverStart = new Date();

app.get<{}, HealthResponse>('/', (req, res) => {
	res.json({
		version: `${version}`,
		serverStart,
		uptime: (Date.now() - serverStart.getTime()) / 1000,
	});
});

app.use(`/api/v${version}`, api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
