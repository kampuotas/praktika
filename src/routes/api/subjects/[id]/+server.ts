import { SubjectTeacher } from '$server/tables/subjects/SubjectTeacher';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const id: number  = parseInt(params.id);
        const { teacherId } = await request.json();

        const subjecTeacher: SubjectTeacher = SubjectTeacher.assign(id, teacherId);

        if (!subjecTeacher) {
            return json({ error: 'Assign was unsuccesfull!' }, { status: 404 });
        }

        return json(subjecTeacher);
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request, params }) => {
    try {
        const id: number = parseInt(params.id);
        const { teacherId } = await request.json();

        const subjectTeacher = SubjectTeacher.findByIdAndTeacher(id, teacherId);

        if (!subjectTeacher) {
            return json({ error: 'SubjectTeacher not found.' }, { status: 404 });
        }

        subjectTeacher.delete();

        return json({ message: 'SubjectTeacher deleted.' });
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};