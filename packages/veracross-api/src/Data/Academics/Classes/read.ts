import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'academics.classes:read';

export type Classe = ResponseData<'read_academics_classes'>;

/** Read Academics: Classes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_classes'>): Promise<Classe> {
    const {data,error} = await client().GET('/academics/classes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Classe', { cause: error });
    }
    return data.data;
}