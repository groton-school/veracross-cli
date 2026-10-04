import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.languages:update';

/** Update Admission: Languages */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_languages'>): Promise<void> {
    const { error } = await client().PATCH('/admission/languages/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Language', { cause: error });
    }
}