import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.citizenships:update';

/** Update Admission: Citizenships */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_citizenships'>): Promise<void> {
    const { error } = await client().PATCH('/admission/citizenships/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Citizenship', { cause: error });
    }
}