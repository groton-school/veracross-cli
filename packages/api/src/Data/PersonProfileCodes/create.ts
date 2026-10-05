import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'person_profile_codes:create';

/** Create Person Profile Codes */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_person_profile_codes'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/person_profile_codes', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreatePersonProfileCode', { cause: error });
    }
    return id;
}