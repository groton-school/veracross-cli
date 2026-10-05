import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'person_visas:read';

export type ReadPersonVisa = ResponseData<operations, 'read_person_visas'>;

/** Read Person Visas */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_person_visas'>): Promise<ReadPersonVisa> {
    const {data,error} = await client().GET('/person_visas/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonVisa', { cause: error });
    }
    return data.data;
}