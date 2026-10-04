import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'relationships:read';

export type ReadRelationship = ResponseData<operations, 'read_relationships'>;

/** Read Relationships */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_relationships'>): Promise<ReadRelationship> {
    const {data,error} = await client().GET('/relationships/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadRelationship', { cause: error });
    }
    return data.data;
}