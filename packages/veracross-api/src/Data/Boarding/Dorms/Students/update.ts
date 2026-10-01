import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'boarding.dorms.students:update';

/** Update Boarding: Dorm Students */
export async function update({ 
    internal_dorm_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_boarding_dorm_students'>): Promise<void> {
    const { error } = await client().PATCH('/boarding/dorms/{internal_dorm_id}/students/{id}', {
        params: { path: { internal_dorm_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating DormStudent', { cause: error });
    }
}