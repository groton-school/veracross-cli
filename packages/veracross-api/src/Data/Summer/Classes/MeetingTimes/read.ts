import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'summer.classes.meeting_times:read';

export type ClassMeetingTime = ResponseData<'read_summer_class_meeting_times'>;

/** Read Summer: Class Meeting Times */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<'read_summer_class_meeting_times'>): Promise<ClassMeetingTime> {
    const {data,error} = await client().GET('/summer/classes/{internal_class_id}/meeting_times/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassMeetingTime', { cause: error });
    }
    return data.data;
}