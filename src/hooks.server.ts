import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return response;
};