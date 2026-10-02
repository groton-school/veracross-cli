import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'master_attendance:read';

export type ReadMasterAttendance = ResponseData<'read_master_attendance'>;

/** Read Master Attendance */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_master_attendance'>): Promise<ReadMasterAttendance> {
    const {data,error} = await client().GET('/master_attendance/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadMasterAttendance', { cause: error });
    }
    return data.data;
}