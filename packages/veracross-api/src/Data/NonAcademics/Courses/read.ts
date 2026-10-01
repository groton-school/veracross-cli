import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'non-academics.courses:read';

export type Course = ResponseData<'read_non_academics_courses'>;

/** Read Non-Academics: Courses */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_non_academics_courses'>): Promise<Course> {
    const {data,error} = await client().GET('/non-academics/courses/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Course', { cause: error });
    }
    return data.data;
}