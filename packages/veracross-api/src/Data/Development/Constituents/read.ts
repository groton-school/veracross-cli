import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'development.constituents:read';

export type Constituent = ResponseData<'read_development_constituents'>;

/** Read Development: Constituents */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_development_constituents'>): Promise<Constituent> {
    const {data,error} = await client().GET('/development/constituents/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Constituent', { cause: error });
    }
    return data.data;
}