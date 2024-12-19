import { Subject } from '$server/tables/subjects/Subject';
import type { Teacher } from '$server/tables/user/Teacher';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, params }) => {
    try {
        const id: number  = parseInt(params.id);

        const subjectWithTeachers: { subject: Subject, teachers: Teacher[] } = Subject.getSubjectWithTeachers(id);

        if (!subjectWithTeachers) {
            return json({ error: 'Teachers not found.' }, { status: 404 });
        }

        return json(subjectWithTeachers);
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};