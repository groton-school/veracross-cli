import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'parents:read';

export type ReadParent = ResponseData<operations, 'read_parents'>;

/** Read Parents */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_parents'>): Promise<ReadParent> {
    const {data,error} = await client().GET('/parents/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadParent', { cause: error });
    }
    return data.data;
}