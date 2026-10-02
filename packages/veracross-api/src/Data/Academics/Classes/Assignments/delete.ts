import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'academics.classes.assignments:delete';

/** Delete Academics: Class Assignments */
export async function delete_({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<'delete_academics_class_assignments'>): Promise<void> {
    const { error } = await client().DELETE('/academics/classes/{internal_class_id}/assignments/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting ClassAssignment', { cause: error });
    }
}