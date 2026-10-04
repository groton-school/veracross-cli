import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.applications:update';

/** Update Admission: Applications */
export async function update({ 
    application_id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_applications'>): Promise<void> {
    const { error } = await client().PATCH('/admission/applications/{application_id}', {
        params: { path: { application_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Application', { cause: error });
    }
}