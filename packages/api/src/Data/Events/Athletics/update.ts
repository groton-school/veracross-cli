import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type AthleticsPatch = RequestData<operations, 'update_events_athletics'>;

export const UPDATE_SCOPE = 'events.athletics:update';

/** Update Events: Athletics */
export async function update({ 
    event_id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_events_athletics'>): Promise<void> {
    const { error } = await client().PATCH('/events/athletics/{event_id}', {
        params: { path: { event_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Athletics', { cause: error });
    }
}