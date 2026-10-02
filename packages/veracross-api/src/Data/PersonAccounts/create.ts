import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'person_accounts:create';

/** Create Person Accounts */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_person_accounts'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/person_accounts', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreatePersonAccount', { cause: error });
    }
    return id;
}