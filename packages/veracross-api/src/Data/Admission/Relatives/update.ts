import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.relatives:update';

/** Update Admission: Relatives */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_relatives'>): Promise<void> {
    const { error } = await client().PATCH('/admission/relatives/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Relative', { cause: error });
    }
}