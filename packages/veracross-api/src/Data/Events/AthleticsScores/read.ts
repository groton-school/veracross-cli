import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'events.athletics_scores:read';

export type AthleticsScore = ResponseData<'read_events_athletics_scores'>;

/** Read Events: Athletics Scores */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_events_athletics_scores'>): Promise<AthleticsScore> {
    const {data,error} = await client().GET('/events/athletics_scores/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving AthleticsScore', { cause: error });
    }
    return data.data;
}