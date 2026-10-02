import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'programs.enrollments:read';

export type Enrollment = ResponseData<'read_programs_enrollments'>;

/** Read Programs: Enrollments */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_programs_enrollments'>): Promise<Enrollment> {
    const {data,error} = await client().GET('/programs/enrollments/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Enrollment', { cause: error });
    }
    return data.data;
}