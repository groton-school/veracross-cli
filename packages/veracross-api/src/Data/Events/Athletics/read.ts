import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'events.athletics:read';

export type Athletic = ResponseData<'read_events_athletics'>;

/** Read Events: Athletics */
export async function read({ 
    event_id, 
    ...rest
}: EndpointOptions<'read_events_athletics'>): Promise<Athletic> {
    const {data,error} = await client().GET('/events/athletics/{event_id}', {
        params: { path: { event_id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Athletic', { cause: error });
    }
    return data.data;
}