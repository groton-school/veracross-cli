import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.households:update';

/** Update Admission: Households */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_households'>): Promise<void> {
    const { error } = await client().PATCH('/admission/households/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Household', { cause: error });
    }
}