import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type UpdateStaffFacultyPatch = RequestData<operations, 'update_staff_faculty'>;

export const UPDATE_SCOPE = 'staff_faculty:update';

/** Update Staff/Faculty */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_staff_faculty'>): Promise<void> {
    const { error } = await client().PATCH('/staff_faculty/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateStaffFaculty', { cause: error });
    }
}