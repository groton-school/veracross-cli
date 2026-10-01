import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'academics.subjects:read';

export type Subject = ResponseData<'read_academics_subjects'>;

/** Read Academics: Subjects */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_subjects'>): Promise<Subject> {
    const {data,error} = await client().GET('/academics/subjects/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Subject', { cause: error });
    }
    return data.data;
}