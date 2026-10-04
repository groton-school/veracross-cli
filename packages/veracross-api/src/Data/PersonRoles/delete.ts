import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'person_roles:delete';

/** Delete Person Roles */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_person_roles'>): Promise<void> {
    const { error } = await client().DELETE('/person_roles/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting DeletePersonRole', { cause: error });
    }
}