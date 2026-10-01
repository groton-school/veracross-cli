import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'contact_info:read';

export type ReadContactInfo = ResponseData<'read_contact_info'>;

/** Read Contact Info */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_contact_info'>): Promise<ReadContactInfo> {
    const {data,error} = await client().GET('/contact_info/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadContactInfo', { cause: error });
    }
    return data.data;
}