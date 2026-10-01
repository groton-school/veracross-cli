import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'academics.class_attendance_statuses:read';

export type ClassAttendanceStatu = ResponseData<'read_academics_class_attendance_status'>;

/** Read Academics: Class Attendance Status */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_class_attendance_status'>): Promise<ClassAttendanceStatu> {
    const {data,error} = await client().GET('/academics/class_attendance_statuses/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassAttendanceStatu', { cause: error });
    }
    return data.data;
}