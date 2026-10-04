import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'person_accounts:delete';

/** Delete Person Accounts */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_person_accounts'>): Promise<void> {
    const { error } = await client().DELETE('/person_accounts/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting DeletePersonAccount', { cause: error });
    }
}