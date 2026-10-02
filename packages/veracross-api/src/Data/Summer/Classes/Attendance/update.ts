import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'summer.classes.attendance:update';

/** Update Summer: Class Attendance */
export async function update({ 
    internal_class_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_summer_class_attendance'>): Promise<void> {
    const { error } = await client().PATCH('/summer/classes/{internal_class_id}/attendance/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ClassAttendance', { cause: error });
    }
}