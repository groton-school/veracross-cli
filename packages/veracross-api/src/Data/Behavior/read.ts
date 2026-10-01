import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'behavior:read';

export type ReadBehavior = ResponseData<'read_behavior'>;

/** Read Behavior */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_behavior'>): Promise<ReadBehavior> {
    const {data,error} = await client().GET('/behavior/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadBehavior', { cause: error });
    }
    return data.data;
}