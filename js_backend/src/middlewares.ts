import { NextFunction, Request, Response } from 'express';

export default interface ErrorResponse {
	error: {
		message: string;
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
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		error: {
			message: err.message,
			stack:
				process.env.NODE_ENV === 'production'
					? undefined
					: err.stack?.split('\n'),
		},
	});
}
