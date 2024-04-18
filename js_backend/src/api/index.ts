import express from 'express';

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

export default router;
