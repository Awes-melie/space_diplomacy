import { ValidateFunction } from 'ajv';
import { NextFunction, Request, Response } from 'express';

export class ErrorMessage extends Error {
	status: number;
	details?: Record<string, unknown>;
	constructor(
		message: string,
		status?: number,
		details?: Record<string, unknown>
	) {
		super(message);
		this.status = status || 500;
		this.details = details;
		Object.setPrototypeOf(this, ErrorMessage.prototype);
	}
}

export class ValidationError extends ErrorMessage {
	constructor(errors: ValidateFunction['errors']) {
		let message = 'Validation error';
		if (errors?.length) {
			let item = errors[0].instancePath.replace('/', '');

			message = `'${item}' ${errors[0].message}` || 'Validation error';
		}
		super(message, 400, { errors });
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export default interface ErrorResponse {
	error: {
		message: string;
		details?: unknown;
		stack?: string[];
	};
}
export function notFound(req: Request, res: Response, next: NextFunction) {
	res.status(404);

	const error = new Error(`404 - Not Found - ${req.originalUrl}`);
	next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
	err: Error,
	req: Request,
	res: Response<ErrorResponse>,
	next: NextFunction
) {
	const statusCode =
		res.statusCode !== 200
			? res.statusCode
			: err instanceof ErrorMessage
			? err.status
			: 500;
	const stack =
		process.env.NODE_ENV === 'production'
			? undefined
			: err.stack?.split('\n');
	const error = {
		message: err.message,
		...(err instanceof ErrorMessage ? { details: err.details } : {}),
		stack,
	};
	console.log(JSON.stringify(error, null, 2));
	res.status(statusCode);
	res.json({ error });
}
