import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'events.athletics_opponents:read';

export type AthleticsOpponent = ResponseData<'read_events_athletics_opponents'>;

/** Read Events: Athletics Opponents */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_events_athletics_opponents'>): Promise<AthleticsOpponent> {
    const {data,error} = await client().GET('/events/athletics_opponents/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving AthleticsOpponent', { cause: error });
    }
    return data.data;
}