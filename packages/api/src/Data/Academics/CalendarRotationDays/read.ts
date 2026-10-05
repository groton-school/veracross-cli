import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.calendar_rotation_days:read';

export type CalendarRotationDay = ResponseData<operations, 'read_academics_calendar_rotation_days'>;

/** Read Academics: Calendar Rotation Days */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_calendar_rotation_days'>): Promise<CalendarRotationDay> {
    const {data,error} = await client().GET('/academics/calendar_rotation_days/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving CalendarRotationDay', { cause: error });
    }
    return data.data;
}