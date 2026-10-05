import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'events.event_attendance:delete';

/** Delete Events: Attendance */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_events_attendance'>): Promise<void> {
    const { error } = await client().DELETE('/events/event_attendance/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting Attendance', { cause: error });
    }
}