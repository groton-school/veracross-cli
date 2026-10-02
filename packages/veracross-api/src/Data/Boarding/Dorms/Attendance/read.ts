import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'boarding.dorms.attendance:read';

export type DormAttendance = ResponseData<'read_boarding_dorm_attendance'>;

/** Read Boarding: Dorm Attendance */
export async function read({ 
    internal_dorm_id, 
    id, 
    ...rest
}: EndpointOptions<'read_boarding_dorm_attendance'>): Promise<DormAttendance> {
    const {data,error} = await client().GET('/boarding/dorms/{internal_dorm_id}/attendance/{id}', {
        params: { path: { internal_dorm_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving DormAttendance', { cause: error });
    }
    return data.data;
}