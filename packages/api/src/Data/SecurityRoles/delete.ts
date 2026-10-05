import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'security_roles:delete';

/** Delete Security Roles */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_security_roles'>): Promise<void> {
    const { error } = await client().DELETE('/security_roles/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting DeleteSecurityRole', { cause: error });
    }
}