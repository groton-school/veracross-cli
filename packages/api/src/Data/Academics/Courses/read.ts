import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.courses:read';

export type Course = ResponseData<operations, 'read_academics_courses'>;

/** Read Academics: Courses */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_courses'>): Promise<Course> {
    const {data,error} = await client().GET('/academics/courses/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Course', { cause: error });
    }
    return data.data;
}