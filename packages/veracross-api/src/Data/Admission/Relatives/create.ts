import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'admission.relatives:create';

/** Create Admission: Relatives */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_admission_relatives'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/admission/relatives', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Relative', { cause: error });
    }
    return id;
}