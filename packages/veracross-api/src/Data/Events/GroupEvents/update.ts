import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'events.group_events:update';

/** Update Events */
export async function update({ 
    event_id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_events'>): Promise<void> {
    const { error } = await client().PATCH('/events/group_events/{event_id}', {
        params: { path: { event_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateEvent', { cause: error });
    }
}