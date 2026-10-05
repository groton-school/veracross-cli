import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type UpdatePortalMembershipPatch = RequestData<operations, 'update_portal_membership'>;

export const UPDATE_SCOPE = 'portal_membership:update';

/** Update Portal Membership */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_portal_membership'>): Promise<void> {
    const { error } = await client().PATCH('/portal_membership/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdatePortalMembership', { cause: error });
    }
}