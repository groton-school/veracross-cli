import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'portal_membership:update';

/** Update Portal Membership */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_portal_membership'>): Promise<void> {
    const { error } = await client().PATCH('/portal_membership/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdatePortalMembership', { cause: error });
    }
}