import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'alumni.demographics:read';

export type Demographic = ResponseData<operations, 'read_alumni_demographics'>;

/** Read Alumni: Demographics */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_alumni_demographics'>): Promise<Demographic> {
    const {data,error} = await client().GET('/alumni/demographics/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Demographic', { cause: error });
    }
    return data.data;
}