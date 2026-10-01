import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'admission.languages:create';

/** Create Admission: Languages */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_admission_languages'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/admission/languages', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Language', { cause: error });
    }
    return id;
}