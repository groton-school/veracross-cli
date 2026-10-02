import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'student_logistics_requests:read';

export type ReadStudentLogisticsRequest = ResponseData<'read_student_logistics_requests'>;

/** Read Student Logistics Requests */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_student_logistics_requests'>): Promise<ReadStudentLogisticsRequest> {
    const {data,error} = await client().GET('/student_logistics_requests/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadStudentLogisticsRequest', { cause: error });
    }
    return data.data;
}