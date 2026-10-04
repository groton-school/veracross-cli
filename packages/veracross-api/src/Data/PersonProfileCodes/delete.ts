import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'person_profile_codes:delete';

/** Delete Person Profile Codes */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_person_profile_codes'>): Promise<void> {
    const { error } = await client().DELETE('/person_profile_codes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting DeletePersonProfileCode', { cause: error });
    }
}