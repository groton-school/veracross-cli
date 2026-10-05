import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.enrollments:read';

export type Enrollment = ResponseData<operations, 'read_academics_enrollments'>;

/** Read Academics: Enrollments */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_enrollments'>): Promise<Enrollment> {
    const {data,error} = await client().GET('/academics/enrollments/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Enrollment', { cause: error });
    }
    return data.data;
}