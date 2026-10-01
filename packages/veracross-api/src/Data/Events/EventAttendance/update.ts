import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'events.event_attendance:update';

/** Update Events: Attendance */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_events_attendance'>): Promise<void> {
    const { error } = await client().PATCH('/events/event_attendance/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Attendance', { cause: error });
    }
}