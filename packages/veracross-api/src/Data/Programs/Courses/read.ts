import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'programs.courses:read';

export type Course = ResponseData<'read_programs_courses'>;

/** Read Programs: Courses */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_programs_courses'>): Promise<Course> {
    const {data,error} = await client().GET('/programs/courses/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Course', { cause: error });
    }
    return data.data;
}