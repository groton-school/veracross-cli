import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'events.athletics_scores:read';

export type AthleticsScore = ResponseData<operations, 'read_events_athletics_scores'>;

/** Read Events: Athletics Scores */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_events_athletics_scores'>): Promise<AthleticsScore> {
    const {data,error} = await client().GET('/events/athletics_scores/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving AthleticsScore', { cause: error });
    }
    return data.data;
}