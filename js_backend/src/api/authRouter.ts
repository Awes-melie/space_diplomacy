import express from 'express';
import { User } from '../models/User';
import { ErrorMessage, ValidationError } from '../middlewares';
import { UserCreationRequestBody, userCreationBodySchema } from '../types/User';
import { makeValidator } from '../validation';

const authRouter = express.Router();

const validateUserCreationRequestBody = makeValidator<UserCreationRequestBody>(
	userCreationBodySchema
);

authRouter.post<{}, unknown>('/register', async (req, res) => {
	const { valid, errors, data } = validateUserCreationRequestBody(req.body);
	if (errors) {
		throw new ValidationError(errors);
	}
	if (valid) {
		const newUser = await User.create(data);
		res.json(newUser);
	}
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
