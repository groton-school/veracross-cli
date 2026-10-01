import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'alumni.demographics:read';

export type Demographic = ResponseData<'read_alumni_demographics'>;

/** Read Alumni: Demographics */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_alumni_demographics'>): Promise<Demographic> {
    const {data,error} = await client().GET('/alumni/demographics/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Demographic', { cause: error });
    }
    return data.data;
}