import { GroupStudent } from '$server/tables/groups/GroupStudent';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const id: number  = parseInt(params.id);
        const { studentId } = await request.json();

        const groupStudent: GroupStudent = GroupStudent.assign(id, studentId);

        if (!groupStudent) {
            return json({ error: 'Assign was unsuccesfull!' }, { status: 404 });
        }

        return json(groupStudent);
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request, params }) => {
    try {
        const id: number = parseInt(params.id);
        const { studentId } = await request.json();

        const groupStudent = GroupStudent.findByIdAndStudent(id, studentId);

        if (!groupStudent) {
            return json({ error: 'GroupStudent not found.' }, { status: 404 });
        }

        groupStudent.delete();

        return json({ message: 'GroupStudent deleted.' });
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};