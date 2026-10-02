import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.classes.meeting_times:read';

export type ClassMeetingTime = ResponseData<'read_academics_class_meeting_times'>;

/** Read Academics: Class Meeting Times */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<'read_academics_class_meeting_times'>): Promise<ClassMeetingTime> {
    const {data,error} = await client().GET('/academics/classes/{internal_class_id}/meeting_times/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassMeetingTime', { cause: error });
    }
    return data.data;
}