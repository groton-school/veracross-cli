import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.config.block_times:read';

export type ConfigurationBlockMeetingTime = ResponseData<operations, 'read_academics_configuration_block_meeting_times'>;

/** Read Academics: Configuration - Block Meeting Times */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_configuration_block_meeting_times'>): Promise<ConfigurationBlockMeetingTime> {
    const {data,error} = await client().GET('/academics/config/block_times/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ConfigurationBlockMeetingTime', { cause: error });
    }
    return data.data;
}