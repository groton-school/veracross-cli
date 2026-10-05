import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type AttendancePatch = RequestData<operations, 'update_events_attendance'>;

export const UPDATE_SCOPE = 'events.event_attendance:update';

/** Update Events: Attendance */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_events_attendance'>): Promise<void> {
    const { error } = await client().PATCH('/events/event_attendance/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Attendance', { cause: error });
    }
}