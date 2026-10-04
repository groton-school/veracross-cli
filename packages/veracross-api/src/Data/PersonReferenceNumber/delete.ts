import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'person_reference_number:delete';

/** Delete Person Reference Number */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_person_reference_number'>): Promise<void> {
    const { error } = await client().DELETE('/person_reference_number/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting DeletePersonReferenceNumber', { cause: error });
    }
}