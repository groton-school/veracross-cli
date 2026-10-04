import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'event_groups:delete';

/** Delete Event Groups */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_event_groups'>): Promise<void> {
    const { error } = await client().DELETE('/event_groups/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting DeleteEventGroup', { cause: error });
    }
}