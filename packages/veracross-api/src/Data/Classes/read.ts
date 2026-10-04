import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'classes:read';

export type ReadClasse = ResponseData<operations, 'read_classes'>;

/** Read Classes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_classes'>): Promise<ReadClasse> {
    const {data,error} = await client().GET('/classes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadClasse', { cause: error });
    }
    return data.data;
}