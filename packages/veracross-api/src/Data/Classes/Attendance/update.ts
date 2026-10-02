import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'classes.attendance:update';

/** Update Class Attendance */
export async function update({ 
    internal_class_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_class_attendance'>): Promise<void> {
    const { error } = await client().PATCH('/classes/{internal_class_id}/attendance/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateClassAttendance', { cause: error });
    }
}