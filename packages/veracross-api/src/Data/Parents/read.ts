import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'parents:read';

export type ReadParent = ResponseData<'read_parents'>;

/** Read Parents */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_parents'>): Promise<ReadParent> {
    const {data,error} = await client().GET('/parents/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadParent', { cause: error });
    }
    return data.data;
}