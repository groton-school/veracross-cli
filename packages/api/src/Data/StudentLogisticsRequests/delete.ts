import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'student_logistics_requests:delete';

/** Delete Student Logistics Requests */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_student_logistics_requests'>): Promise<void> {
    const { error } = await client().DELETE('/student_logistics_requests/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting DeleteStudentLogisticsRequest', { cause: error });
    }
}