import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'external_user_accounts:update';

/** Update External User Accounts */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_external_user_accounts'>): Promise<void> {
    const { error } = await client().PATCH('/external_user_accounts/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateExternalUserAccount', { cause: error });
    }
}