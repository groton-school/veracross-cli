import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'admission.citizenships:create';

/** Create Admission: Citizenships */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_admission_citizenships'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/admission/citizenships', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Citizenship', { cause: error });
    }
    return id;
}