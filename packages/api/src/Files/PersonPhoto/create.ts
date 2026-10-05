import { operations } from '#spec/Files-API.js';
import { client } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'files:person_photo:create';

/** Create Person Photo */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_person_photo'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/person_photo', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreatePersonPhoto', { cause: error });
    }
    return id;
}