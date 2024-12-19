import { Grade } from '$server/tables/grades/Grade';
import { Group } from '$server/tables/groups/Group';
import type { Student } from '$server/tables/user/Student';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, params }) => {
    try {
        const groupid: number  = parseInt(params.groupid);
        const studentid: number  = parseInt(params.studentid);
        
        if(groupid === 0 || studentid === 0){
            return json({ error: 'Invalid group or student id.' }, { status: 404 });
        }

        const grades: Grade[] = Grade.getGradesByGroupAndStudent(groupid, studentid);

        if (!grades) {
            return json({ error: 'Grades not found.' }, { status: 404 });
        }

        return json(grades);
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};