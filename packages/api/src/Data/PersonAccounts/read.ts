import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'person_accounts:read';

export type ReadPersonAccount = ResponseData<operations, 'read_person_accounts'>;

/** Read Person Accounts */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_person_accounts'>): Promise<ReadPersonAccount> {
    const {data,error} = await client().GET('/person_accounts/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonAccount', { cause: error });
    }
    return data.data;
}