import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'households:read';

export type ReadHousehold = ResponseData<'read_households'>;

/** Read Households */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_households'>): Promise<ReadHousehold> {
    const {data,error} = await client().GET('/households/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadHousehold', { cause: error });
    }
    return data.data;
}