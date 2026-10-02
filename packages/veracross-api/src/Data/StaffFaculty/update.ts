import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'staff_faculty:update';

/** Update Staff/Faculty */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_staff_faculty'>): Promise<void> {
    const { error } = await client().PATCH('/staff_faculty/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateStaffFaculty', { cause: error });
    }
}