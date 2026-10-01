import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'portal_membership:read';

export type ReadPortalMembership = ResponseData<'read_portal_membership'>;

/** Read Portal Membership */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_portal_membership'>): Promise<ReadPortalMembership> {
    const {data,error} = await client().GET('/portal_membership/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPortalMembership', { cause: error });
    }
    return data.data;
}