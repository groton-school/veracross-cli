import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'academics.config.blocks_by_block_groups:read';

export type BlocksByGroup = ResponseData<'read_academics_blocks_by_group'>;

/** Read Academics: Blocks by Group */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_blocks_by_group'>): Promise<BlocksByGroup> {
    const {data,error} = await client().GET('/academics/config/blocks_by_block_groups/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving BlocksByGroup', { cause: error });
    }
    return data.data;
}