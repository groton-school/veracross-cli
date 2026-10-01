import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'person_reference_number:create';

/** Create Person Reference Number */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_person_reference_number'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/person_reference_number', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreatePersonReferenceNumber', { cause: error });
    }
    return id;
}