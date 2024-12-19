import { parse } from 'cookie';

import { Student } from '$server/tables/user/Student';
import { User } from '$server/tables/user/User';
import type { PageServerLoad } from './$types';

export const load = (({request}) => {
    const cookies = request.headers.get('cookie');
    const {id} = parse(cookies || '');

    if(!id){
        return {};
    }

    const user: Student | null = Student.findById(parseInt(id));
    if(!user){  
        return {};
    }

    const grades: any = (user as Student).getGrades();
    
    return {
        grades
    };
}) satisfies PageServerLoad;