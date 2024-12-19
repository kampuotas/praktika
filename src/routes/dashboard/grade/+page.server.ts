import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { parse } from 'cookie';

import { Group } from '$server/tables/groups/Group';
import { Teacher } from '$server/tables/user/Teacher';
import { User } from '$server/tables/user/User';
import { Grade } from '$server/tables/grades/Grade'; 

export const load: PageServerLoad = async ({ request }) => {
    const cookieHeader = request.headers.get('cookie');
    const { loggedIn, role, id } = parse(cookieHeader || '');

    if (!id) {
        return;
    }

    let groups: Group[] = [];

    if (role === "Admin") {
        groups = Group.getAll();
    } else {
        const teacher = Teacher.findById(Number(id));
        if (!teacher) {
            return;
        }
        groups = Group.getAllByTeacher(teacher);
    }

    const serializedGroups = groups.map(group => group.toJSON());

    return {
        serializedGroups
    };
};

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const action = data.get('action')?.toString(); 

        if (action === 'grade') {
            const group_id = parseInt(data.get('group_id')?.toString() || '', 10);
            const student_id = parseInt(data.get('student_id')?.toString() || '', 10);
            const gradeValue = parseFloat(data.get('grade')?.toString() || '');

            if (isNaN(group_id) || isNaN(student_id)) {
                return fail(400, { errorMessage: 'Invalid group or student ID for grading.' });
            }

            if (isNaN(gradeValue)) {
                return fail(400, { errorMessage: 'Invalid grade.' });
            }

            const datetimeInput = data.get('datetime')?.toString();
            if (!datetimeInput) {
                return fail(400, { errorMessage: 'Invalid datetime.' });
            }

            const datetime: number = new Date(datetimeInput).getTime();

            try {
                const newGrade = Grade.grade(datetime, student_id, group_id, gradeValue);

                return { success: true, message: 'Grade assigned successfully.' };
            } catch (error) {
                console.error(error);
                return fail(500, { errorMessage: 'An error occurred while assigning the grade. Please try again.' });
            }
        }

        return {};
    }
};
