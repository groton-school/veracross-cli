import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'extended_care.courses:read';

export type Course = ResponseData<operations, 'read_extended_care_courses'>;

/** Read Extended Care: Courses */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_extended_care_courses'>): Promise<Course> {
    const {data,error} = await client().GET('/extended_care/courses/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Course', { cause: error });
    }
    return data.data;
}