import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'student_logistics_requests:create';

/** Create Student Logistics Requests */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_student_logistics_requests'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/student_logistics_requests', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateStudentLogisticsRequest', { cause: error });
    }
    return id;
}