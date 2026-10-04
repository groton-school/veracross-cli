import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.classes.assignments:update';

/** Update Academics: Class Assignments */
export async function update({ 
    internal_class_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_class_assignments'>): Promise<void> {
    const { error } = await client().PATCH('/academics/classes/{internal_class_id}/assignments/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ClassAssignment', { cause: error });
    }
}