import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'person_visas:read';

export type ReadPersonVisa = ResponseData<'read_person_visas'>;

/** Read Person Visas */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_person_visas'>): Promise<ReadPersonVisa> {
    const {data,error} = await client().GET('/person_visas/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonVisa', { cause: error });
    }
    return data.data;
}