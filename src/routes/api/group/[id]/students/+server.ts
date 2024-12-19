import { Group } from '$server/tables/groups/Group';
import type { Student } from '$server/tables/user/Student';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, params }) => {
    try {
        const id: number  = parseInt(params.id);

        const groupWithStudents: { group: Group, students: Student[] } = Group.getGroupWithStudents(id);

        if (!groupWithStudents) {
            return json({ error: 'Students not found.' }, { status: 404 });
        }

        return json(groupWithStudents);
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};