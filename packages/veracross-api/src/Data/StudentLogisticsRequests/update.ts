import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'student_logistics_requests:update';

/** Update Student Logistics Requests */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_student_logistics_requests'>): Promise<void> {
    const { error } = await client().PATCH('/student_logistics_requests/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateStudentLogisticsRequest', { cause: error });
    }
}