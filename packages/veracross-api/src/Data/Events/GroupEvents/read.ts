import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'events.group_events:read';

export type ReadEvent = ResponseData<operations, 'read_events'>;

/** Read Events */
export async function read({ 
    event_id, 
    ...rest
}: EndpointOptions<operations, 'read_events'>): Promise<ReadEvent> {
    const {data,error} = await client().GET('/events/group_events/{event_id}', {
        params: { path: { event_id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadEvent', { cause: error });
    }
    return data.data;
}