import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'summer.classes.attendance:read';

export type ClassAttendance = ResponseData<'read_summer_class_attendance'>;

/** Read Summer: Class Attendance */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<'read_summer_class_attendance'>): Promise<ClassAttendance> {
    const {data,error} = await client().GET('/summer/classes/{internal_class_id}/attendance/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassAttendance', { cause: error });
    }
    return data.data;
}