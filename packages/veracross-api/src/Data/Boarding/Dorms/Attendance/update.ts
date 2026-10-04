import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'boarding.dorms.attendance:update';

/** Update Boarding: Dorm Attendance */
export async function update({ 
    internal_dorm_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_boarding_dorm_attendance'>): Promise<void> {
    const { error } = await client().PATCH('/boarding/dorms/{internal_dorm_id}/attendance/{id}', {
        params: { path: { internal_dorm_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating DormAttendance', { cause: error });
    }
}