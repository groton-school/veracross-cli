import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'summer.enrollments:read';

export type Enrollment = ResponseData<'read_summer_enrollments'>;

/** Read Summer: Enrollments */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_summer_enrollments'>): Promise<Enrollment> {
    const {data,error} = await client().GET('/summer/enrollments/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Enrollment', { cause: error });
    }
    return data.data;
}