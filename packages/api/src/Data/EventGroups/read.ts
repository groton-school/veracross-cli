import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'event_groups:read';

export type ReadEventGroup = ResponseData<operations, 'read_event_groups'>;

/** Read Event Groups */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_event_groups'>): Promise<ReadEventGroup> {
    const {data,error} = await client().GET('/event_groups/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadEventGroup', { cause: error });
    }
    return data.data;
}