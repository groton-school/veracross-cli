import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'events.athletics_scores:update';

/** Update Events: Athletics Scores */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_events_athletics_scores'>): Promise<void> {
    const { error } = await client().PATCH('/events/athletics_scores/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating AthleticsScore', { cause: error });
    }
}