import type { PageServerLoad } from './$types';
import { Subject } from '$server/tables/subjects/Subject';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { Student } from '$server/tables/user/Student';
import { Group } from '$server/tables/groups/Group';

export const load = (async () => {
    const groups = Group.getAll();
    const subjects = Subject.getAll();
    const students = Student.getAll();
    
    const serializedGroups = groups.map(group => group.toJSON());
    const serializedSubjects = subjects.map(subject => subject.toJSON());
    const serializedStudents = students.map(student => student.toJSON());

    return {
        serializedGroups,
        serializedSubjects,
        serializedStudents
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const action = data.get('action')?.toString(); 
        if (action === 'create') {
            const name = data.get('name')?.toString();
            const description = data.get('description')?.toString();

            if (!(name && description)) {
                return fail(400, { errorMessage: 'Missing name and description.' });
            }

            try {
                const existingGroup = Group.findByName(name);
                if (existingGroup) {
                    return fail(400, { errorMessage: 'Group already exists.' });
                }

                Group.create(name, description);
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while registering. Please try again.' });
            }

        } else if (action === 'delete') {
            const id = parseInt(data.get('id')?.toString() || '', 10);
            if (isNaN(id)) {
                return fail(400, { errorMessage: 'Invalid group ID for deletion.' });
            }

            try {
                const group = Group.findById(id);
                if (!group) {
                    return fail(404, { errorMessage: 'Group not found.' });
                }

                group.delete();
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while deleting the user. Please try again.' });
            }

        } else if (action == "update") {
            const id = parseInt(data.get('id')?.toString() || '', 10);
            if (isNaN(id)) {
                return fail(400, { errorMessage: 'Invalid group ID for update.' });
            }

            try {
                const group = Group.findById(id);
                if (!group) {
                    return fail(404, { errorMessage: 'Group not found.' });
                }
                
                const name = data.get('name')?.toString();
                const description = data.get('description')?.toString();
                if (!(name && description)) {
                    return fail(400, { errorMessage: 'Missing name.' });
                }

                group.name = name;
                group.description = description;

                group.update();
                throw redirect(303, '/');
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while updating the user. Please try again.' });
            }
        }

        return {};
    }
};
