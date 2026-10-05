import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'external_user_accounts:create';

/** Create External User Accounts */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_external_user_accounts'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/external_user_accounts', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateExternalUserAccount', { cause: error });
    }
    return id;
}