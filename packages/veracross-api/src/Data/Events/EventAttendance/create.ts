import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'events.event_attendance:create';

/** Create Events: Attendance */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_events_attendance'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/events/event_attendance', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Attendance', { cause: error });
    }
    return id;
}