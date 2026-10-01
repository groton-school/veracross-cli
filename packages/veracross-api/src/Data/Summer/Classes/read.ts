import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'summer.classes:read';

export type Classe = ResponseData<'read_summer_classes'>;

/** Read Summer: Classes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_summer_classes'>): Promise<Classe> {
    const {data,error} = await client().GET('/summer/classes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Classe', { cause: error });
    }
    return data.data;
}