import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'master_attendance:update';

/** Update Master Attendance */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_master_attendance'>): Promise<void> {
    const { error } = await client().PATCH('/master_attendance/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateMasterAttendance', { cause: error });
    }
}