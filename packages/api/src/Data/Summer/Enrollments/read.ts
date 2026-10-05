import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'summer.enrollments:read';

export type Enrollment = ResponseData<operations, 'read_summer_enrollments'>;

/** Read Summer: Enrollments */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_summer_enrollments'>): Promise<Enrollment> {
    const {data,error} = await client().GET('/summer/enrollments/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Enrollment', { cause: error });
    }
    return data.data;
}