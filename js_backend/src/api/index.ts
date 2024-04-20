import express from 'express';

import authRouter from './authRouter';
interface CountResponse {
	count: number;
}

let count = 0;

const router = express.Router();

router.get<{}, CountResponse>('/', (req, res) => {
	//throw new Error('bad');
	res.json({ count });
});

router.post<{}, CountResponse>('/inc', (req, res) => {
	res.json({ count: ++count });
});

router.use(`auth`, authRouter);

export default router;
