import express from 'express';
import { User } from '../models/User';
import { ErrorMessage } from '../middlewares';

const authRouter = express.Router();

authRouter.post<{}, unknown>('/register', async (req, res) => {
	const newUser = await User.create(req.body.email, req.body.displayName);
	res.json(newUser);
});

authRouter.post<{}, unknown>('/verify-email', async (req, res) => {
	const verifiedUser = await User.verify(
		req.body.email,
		req.body.verificationCode,
		req.body.password1,
		req.body.password2
	);
	res.json(verifiedUser);
});

authRouter.post<{}, unknown>('/login', async (req, res) => {
	// TODO
	throw new ErrorMessage('not implemented', 501);

	// res.json();
});

export default authRouter;
