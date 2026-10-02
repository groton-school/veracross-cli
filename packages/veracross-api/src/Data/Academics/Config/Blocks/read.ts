import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.config.blocks:read';

export type ConfigurationBlocksPeriod = ResponseData<'read_academics_configuration_blocks_periods'>;

/** Read Academics: Configuration - Blocks/Periods */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_configuration_blocks_periods'>): Promise<ConfigurationBlocksPeriod> {
    const {data,error} = await client().GET('/academics/config/blocks/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ConfigurationBlocksPeriod', { cause: error });
    }
    return data.data;
}