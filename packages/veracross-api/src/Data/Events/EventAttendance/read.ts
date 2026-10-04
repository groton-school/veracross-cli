import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'events.event_attendance:read';

export type Attendance = ResponseData<operations, 'read_events_attendance'>;

/** Read Events: Attendance */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_events_attendance'>): Promise<Attendance> {
    const {data,error} = await client().GET('/events/event_attendance/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Attendance', { cause: error });
    }
    return data.data;
}