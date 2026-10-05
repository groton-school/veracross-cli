import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'external_user_accounts:read';

export type ReadExternalUserAccount = ResponseData<operations, 'read_external_user_accounts'>;

/** Read External User Accounts */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_external_user_accounts'>): Promise<ReadExternalUserAccount> {
    const {data,error} = await client().GET('/external_user_accounts/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadExternalUserAccount', { cause: error });
    }
    return data.data;
}