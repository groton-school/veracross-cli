import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.languages:update';

/** Update Admission: Languages */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_admission_languages'>): Promise<void> {
    const { error } = await client().PATCH('/admission/languages/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Language', { cause: error });
    }
}