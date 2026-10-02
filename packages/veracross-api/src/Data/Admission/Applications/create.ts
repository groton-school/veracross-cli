import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'admission.applications:create';

/** Create Admission: Applications */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_admission_applications'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/admission/applications', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Application', { cause: error });
    }
    return id;
}