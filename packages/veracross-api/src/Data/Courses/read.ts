import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'courses:read';

export type ReadCourse = ResponseData<operations, 'read_courses'>;

/** Read Courses */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_courses'>): Promise<ReadCourse> {
    const {data,error} = await client().GET('/courses/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadCourse', { cause: error });
    }
    return data.data;
}