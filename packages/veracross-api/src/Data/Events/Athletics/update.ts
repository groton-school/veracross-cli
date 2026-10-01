import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'events.athletics:update';

/** Update Events: Athletics */
export async function update({ 
    event_id, 
    data,
    ...rest
}: EndpointOptions<'update_events_athletics'>): Promise<void> {
    const { error } = await client().PATCH('/events/athletics/{event_id}', {
        params: { path: { event_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Athletic', { cause: error });
    }
}