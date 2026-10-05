import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.assignments.grades:read';

export type AssignmentGrade = ResponseData<operations, 'read_academics_assignment_grades'>;

/** Read Academics: Assignment Grades */
export async function read({ 
    assignment_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_assignment_grades'>): Promise<AssignmentGrade> {
    const {data,error} = await client().GET('/academics/assignments/{assignment_id}/grades/{id}', {
        params: { path: { assignment_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving AssignmentGrade', { cause: error });
    }
    return data.data;
}