const BACKEND = 'http://localhost:3000';

class ApiError extends Error {
	apiStack?: string[];
	constructor(err: { message: string; stack?: string[] }) {
		super(err.message);
		this.apiStack = err.stack;
		Object.setPrototypeOf(this, ApiError.prototype);
	}
}

type ApiSuccessResponse<T> = {
	status: number;
	error: null;
	data: T;
};

type ApiErrorResponse = {
	data: null;
	error: Error;
	status?: number;
};

interface APIOptions extends Omit<RequestInit, 'body'> {
	body?: Record<string, unknown>;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export async function api<T>(
	path: string,
	options?: APIOptions
): Promise<ApiResponse<T>> {
	let status;
	try {
		const requestInit: RequestInit = {
			...options,
			body: undefined,
		};
		if (options?.body) {
			requestInit.body = JSON.stringify(options.body);
			requestInit.headers = new Headers(requestInit.headers);
			requestInit.headers.set('Accept', 'application/json');
			requestInit.headers.set('Content-Type', 'application/json');
		}
		const response = await fetch(`${BACKEND}/api/v1${path}`, {
			...requestInit,
		});
		status = response.status;
		const data = await response.json();
		if (data.error) {
			throw new ApiError(data.error);
		}
		return { data, status, error: null };
	} catch (err) {
		const error = err instanceof Error ? err : new Error(`${err}`);
		console.log(`API Error: ${error.message}`, {
			method: options?.method || 'GET',
			path,
			stack: error.stack,
			...(error instanceof ApiError ? { apiStack: error.apiStack } : {}),
		});
		return { error, status, data: null };
	}
}
