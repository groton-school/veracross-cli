import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'development.gifts:read';

export type Gift = ResponseData<'read_development_gifts'>;

/** Read Development: Gifts */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_development_gifts'>): Promise<Gift> {
    const {data,error} = await client().GET('/development/gifts/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Gift', { cause: error });
    }
    return data.data;
}