import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import { Status, mongo } from './database';
import { databaseMaintenance } from './databaseMaintenance';

interface HealthResponse {
	version: string;
	serverStart: Date;
	uptime: number;
	healthy: boolean;
}

require('dotenv').config();

export const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const version = `1`;
const serverStart = new Date();

app.get<{}, HealthResponse>('/', (req, res) => {
	const mongoStatus = mongo.getStatus();

	res.json({
		healthy: mongoStatus === Status.Connected,
		version: `${version}`,
		serverStart,
		uptime: (Date.now() - serverStart.getTime()) / 1000,
	});
});

app.use(`/api/v${version}`, api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export async function startApp() {
	console.log(`Connecting to database`);
	await mongo.connect();

	await databaseMaintenance();

	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Listening: http://localhost:${port}`);
	});
}
