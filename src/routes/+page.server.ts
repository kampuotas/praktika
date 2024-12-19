import { fail, redirect, type Actions, type Cookies } from '@sveltejs/kit';
import { User } from '$server/tables/user/User';
import type { PageServerLoad } from './$types';
import { parse } from 'cookie';
import { Role } from '$server/tables/user/Role';

export const load = (({request}) => {
    const cookies = request.headers.get('cookie');
    const {loggedIn, role} = parse(cookies || '');

    if(!!loggedIn){
        throw redirect(303, '/dashboard/');
    }

    return {
        loggedIn: !!loggedIn,
        role: role
    };
}) satisfies PageServerLoad;


async function login(cookies: Cookies, user: User){
    cookies.set('username', user.username, { path: '/' });
    cookies.set('role', user.role.toString(), { path: '/' });
    cookies.set('id', user.id.toString(), { path: '/' });
    cookies.set('loggedIn', 'true', { path: '/' });
}

export const actions: Actions = {
    default: async ({request, cookies}) => {
        const data = await request.formData();
        const username = data.get('username')?.toString(); 
        const password = data.get('password')?.toString(); 

        if(!(username && password)){
            return fail(400, {error: "Missing username and password!"});
        }   

        const response: boolean | User = await User.login(username, password);
        if(!response){
            return fail(400, {error: "Unauthorized!"});
        }

        const user = response as User;

        login(cookies, user);
        if (user.role === Role.Student) {
            throw redirect(303, '/dashboard/grades');
        } else if (user.role === Role.Admin) {
            throw redirect(303, '/dashboard/');
        } else if (user.role === Role.Teacher) {
            throw redirect(303, '/dashboard/grade');
        } else {
            return fail(403, { error: "Unknown role. Access denied!" });
        }
    }
};
