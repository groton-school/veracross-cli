import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'courses:read';

export type ReadCourse = ResponseData<'read_courses'>;

/** Read Courses */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_courses'>): Promise<ReadCourse> {
    const {data,error} = await client().GET('/courses/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadCourse', { cause: error });
    }
    return data.data;
}