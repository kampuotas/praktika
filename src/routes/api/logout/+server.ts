import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
    return json(
        { message: 'Logged out successfully' },
        {
            headers: {
                'Set-Cookie': 'loggedIn=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            },
        }
    );
};