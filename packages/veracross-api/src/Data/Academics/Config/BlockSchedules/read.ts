import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.config.block_schedules:read';

export type ConfigurationBlockSchedule = ResponseData<'read_academics_configuration_block_schedules'>;

/** Read Academics: Configuration - Block Schedules */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_configuration_block_schedules'>): Promise<ConfigurationBlockSchedule> {
    const {data,error} = await client().GET('/academics/config/block_schedules/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ConfigurationBlockSchedule', { cause: error });
    }
    return data.data;
}