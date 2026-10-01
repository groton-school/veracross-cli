import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'athletics.sports:read';

export type Sport = ResponseData<'read_athletics_sports'>;

/** Read Athletics: Sports */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_athletics_sports'>): Promise<Sport> {
    const {data,error} = await client().GET('/athletics/sports/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Sport', { cause: error });
    }
    return data.data;
}