import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'events.athletics:read';

export type Athletics = ResponseData<operations, 'read_events_athletics'>;

/** Read Events: Athletics */
export async function read({ 
    event_id, 
    ...rest
}: EndpointOptions<operations, 'read_events_athletics'>): Promise<Athletics> {
    const {data,error} = await client().GET('/events/athletics/{event_id}', {
        params: { path: { event_id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Athletics', { cause: error });
    }
    return data.data;
}