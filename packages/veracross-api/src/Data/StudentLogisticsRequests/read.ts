import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'student_logistics_requests:read';

export type ReadStudentLogisticsRequest = ResponseData<operations, 'read_student_logistics_requests'>;

/** Read Student Logistics Requests */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_student_logistics_requests'>): Promise<ReadStudentLogisticsRequest> {
    const {data,error} = await client().GET('/student_logistics_requests/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadStudentLogisticsRequest', { cause: error });
    }
    return data.data;
}