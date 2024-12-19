import type { LayoutServerLoad } from './$types';
import { parse } from 'cookie';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ request }) => {
    const cookies = request.headers.get('cookie');
    const {loggedIn, role } = parse(cookies || '');

    if(!loggedIn){
        throw redirect(303, '/')
    }

    return {
        role
    };
};