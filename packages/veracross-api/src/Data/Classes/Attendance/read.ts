import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'classes.attendance:read';

export type ReadClassAttendance = ResponseData<'read_class_attendance'>;

/** Read Class Attendance */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<'read_class_attendance'>): Promise<ReadClassAttendance> {
    const {data,error} = await client().GET('/classes/{internal_class_id}/attendance/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadClassAttendance', { cause: error });
    }
    return data.data;
}