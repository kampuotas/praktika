import type { PageServerLoad } from './$types';
import { User } from '$server/tables/user/User';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { Role } from '$server/tables/user/Role';

export const load = (async () => {
    const users = User.getAll();
    const serializedUsers = users.map(user => user.toJSON());

    return {
        serializedUsers,
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const action = data.get('action')?.toString(); 

        if (action === 'delete') {
            const id = parseInt(data.get('id')?.toString() || '', 10);
            if (isNaN(id)) {
                return fail(400, { errorMessage: 'Invalid user ID for deletion.' });
            }

            try {
                const user = User.findById(id);
                if (!user) {
                    return fail(404, { errorMessage: 'User not found.' });
                }

                user.delete();
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while deleting the user. Please try again.' });
            }
        } else if (action === 'create') {
            const username = data.get('username')?.toString();
            const password = data.get('password')?.toString();
            const role = data.get('role')?.toString();
            const name = data.get('name')?.toString();
            const surname = data.get('surname')?.toString();
            if (!(username && password && role)) {
                return fail(400, { errorMessage: 'Missing username, password, or role.' });
            }

            try {
                const existingUser = User.findByUsername(username);
                if (existingUser) {
                    return fail(400, { errorMessage: 'Username already exists.' });
                }

                User.create(username, password, role, name as string, surname as string);
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while registering. Please try again.' });
            }
        } else if (action == "update") {
            const id = parseInt(data.get('id')?.toString() || '', 10);
            if (isNaN(id)) {
                return fail(400, { errorMessage: 'Invalid user ID for update.' });
            }

            try {
                const user = User.findById(id);
                if (!user) {
                    return fail(404, { errorMessage: 'User not found.' });
                }
                
                const username = data.get('username')?.toString();
                const password = data.get('password')?.toString();
                const role = data.get('role')?.toString();
                const name = data.get('name')?.toString();
                const surname = data.get('surname')?.toString();
                if (!(username && role)) {
                    return fail(400, { errorMessage: 'Missing username, or role.' });
                }

                user.username = username;
                user.password = password;
                user.role = role as Role;
                user.name = name;
                user.surname = surname;

                user.update();
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while updating the user. Please try again.' });
            }
        }

        return {};
    }
};
