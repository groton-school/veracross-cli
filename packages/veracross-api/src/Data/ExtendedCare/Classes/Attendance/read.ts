import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'extended_care.classes.attendance:read';

export type ClassAttendance = ResponseData<'read_extended_care_class_attendance'>;

/** Read Extended Care: Class Attendance */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<'read_extended_care_class_attendance'>): Promise<ClassAttendance> {
    const {data,error} = await client().GET('/extended_care/classes/{internal_class_id}/attendance/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassAttendance', { cause: error });
    }
    return data.data;
}