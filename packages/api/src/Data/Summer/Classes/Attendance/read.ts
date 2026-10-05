import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'summer.classes.attendance:read';

export type ClassAttendance = ResponseData<operations, 'read_summer_class_attendance'>;

/** Read Summer: Class Attendance */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_summer_class_attendance'>): Promise<ClassAttendance> {
    const {data,error} = await client().GET('/summer/classes/{internal_class_id}/attendance/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassAttendance', { cause: error });
    }
    return data.data;
}