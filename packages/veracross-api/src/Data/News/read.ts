import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'news:read';

export type ReadNew = ResponseData<'read_news'>;

/** Read News */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_news'>): Promise<ReadNew> {
    const {data,error} = await client().GET('/news/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadNew', { cause: error });
    }
    return data.data;
}