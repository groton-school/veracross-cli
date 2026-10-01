import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'academics.calendar_rotation_days:read';

export type CalendarRotationDay = ResponseData<'read_academics_calendar_rotation_days'>;

/** Read Academics: Calendar Rotation Days */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_calendar_rotation_days'>): Promise<CalendarRotationDay> {
    const {data,error} = await client().GET('/academics/calendar_rotation_days/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving CalendarRotationDay', { cause: error });
    }
    return data.data;
}