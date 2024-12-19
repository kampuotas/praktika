import { SubjectGroup } from '$server/tables/groups/SubjectGroup';
import { Group } from '$server/tables/groups/Group';
import type { Subject } from '$server/tables/subjects/Subject';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, params }) => {
    try {
        const id: number  = parseInt(params.id);

        const groupSubject: { group: Group, subject: Subject } = Group.getGroupSubject(id);

        if (!groupSubject) {
            return json({ error: 'Subject not found.' }, { status: 404 });
        }   
        
        return json(groupSubject);
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const id: number  = parseInt(params.id);
        const { subjectId } = await request.json();

        const subjectGroup: SubjectGroup = SubjectGroup.assign(subjectId, id);

        if (!subjectGroup) {
            return json({ error: 'Group or Subject not found.' }, { status: 404 });
        }

        return json(subjectGroup);
    } catch (error) {
        console.error(error);
        return json({ error: 'An error occurred during the data process.' }, { status: 500 });
    }
};