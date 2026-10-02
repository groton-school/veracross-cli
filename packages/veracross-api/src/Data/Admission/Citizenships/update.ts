import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.citizenships:update';

/** Update Admission: Citizenships */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_admission_citizenships'>): Promise<void> {
    const { error } = await client().PATCH('/admission/citizenships/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Citizenship', { cause: error });
    }
}