const BACKEND = 'http://localhost:3000';
export const api = async (path: string, options?: RequestInit) => {
	try {
		const res = await fetch(`${BACKEND}${path}`, options);
		return [await res.json()];
	} catch (err) {
		return [undefined, err];
	}
};