import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.config.block_groups:read';

export type BlockGroup = ResponseData<operations, 'read_academics_block_groups'>;

/** Read Academics: Block Groups */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_block_groups'>): Promise<BlockGroup> {
    const {data,error} = await client().GET('/academics/config/block_groups/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving BlockGroup', { cause: error });
    }
    return data.data;
}