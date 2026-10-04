import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'person_reference_number:update';

/** Update Person Reference Number */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_person_reference_number'>): Promise<void> {
    const { error } = await client().PATCH('/person_reference_number/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdatePersonReferenceNumber', { cause: error });
    }
}