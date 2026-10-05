import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ClassAttendanceStatusPatch = RequestData<operations, 'update_academics_class_attendance_status'>;

export const UPDATE_SCOPE = 'academics.class_attendance_statuses:update';

/** Update Academics: Class Attendance Status */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_class_attendance_status'>): Promise<void> {
    const { error } = await client().PATCH('/academics/class_attendance_statuses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ClassAttendanceStatus', { cause: error });
    }
}