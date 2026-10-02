import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.student_assignments:read';

export type StudentAssignment = ResponseData<'read_academics_student_assignments'>;

/** Read Academics: Student Assignments */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_student_assignments'>): Promise<StudentAssignment> {
    const {data,error} = await client().GET('/academics/student_assignments/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving StudentAssignment', { cause: error });
    }
    return data.data;
}