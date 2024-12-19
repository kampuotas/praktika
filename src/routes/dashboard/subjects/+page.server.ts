import type { PageServerLoad } from './$types';
import { Subject } from '$server/tables/subjects/Subject';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { Teacher } from '$server/tables/user/Teacher';

export const load = (async () => {
    const subjects = Subject.getAll();
    const teachers = Teacher.getAll();
    
    const serializedSubjects = subjects.map(subject => subject.toJSON());
    const serializedTeachers = teachers.map(teacher => teacher.toJSON());

    return {
        serializedSubjects,
        serializedTeachers
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const action = data.get('action')?.toString(); 
        if (action === 'create') {
            const name = data.get('name')?.toString();
            if (!(name)) {
                return fail(400, { errorMessage: 'Missing name.' });
            }

            try {
                const existingSubject = Subject.findByName(name);
                if (existingSubject) {
                    return fail(400, { errorMessage: 'Subject already exists.' });
                }

                Subject.create(name);
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while registering. Please try again.' });
            }

        } else if (action === 'delete') {
            const id = parseInt(data.get('id')?.toString() || '', 10);
            if (isNaN(id)) {
                return fail(400, { errorMessage: 'Invalid subject ID for deletion.' });
            }

            try {
                const subject = Subject.findById(id);
                if (!subject) {
                    return fail(404, { errorMessage: 'Subject not found.' });
                }

                subject.delete();
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while deleting the user. Please try again.' });
            }

        } else if (action == "update") {
            const id = parseInt(data.get('id')?.toString() || '', 10);
            if (isNaN(id)) {
                return fail(400, { errorMessage: 'Invalid subject ID for update.' });
            }

            try {
                const subject = Subject.findById(id);
                if (!subject) {
                    return fail(404, { errorMessage: 'Subject not found.' });
                }
                
                const name = data.get('name')?.toString();
                if (!(name)) {
                    return fail(400, { errorMessage: 'Missing name.' });
                }

                subject.name = name;

                subject.update();
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while updating the user. Please try again.' });
            }
        }

        return {};
    }
};
