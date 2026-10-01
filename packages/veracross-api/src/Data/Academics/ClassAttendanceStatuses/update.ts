import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.class_attendance_statuses:update';

/** Update Academics: Class Attendance Status */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_class_attendance_status'>): Promise<void> {
    const { error } = await client().PATCH('/academics/class_attendance_statuses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ClassAttendanceStatu', { cause: error });
    }
}