import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'non-academics.classes:read';

export type Classe = ResponseData<'read_non_academics_classes'>;

/** Read Non-Academics: Classes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_non_academics_classes'>): Promise<Classe> {
    const {data,error} = await client().GET('/non-academics/classes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Classe', { cause: error });
    }
    return data.data;
}