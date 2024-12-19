import { Grade } from '$server/tables/grades/Grade';
import { Group } from '$server/tables/groups/Group';
import type { Student } from '$server/tables/user/Student';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ request, params }) => {
    try {
        const gradeId: number  = parseInt(params.id);
        
        if(gradeId === 0){
            return json({ error: 'Invalid grade id.' }, { status: 404 });
        }

        const grade: Grade | null = Grade.findById(gradeId);

        grade.delete();

        return json({ message: 'Grade deleted.' });
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};