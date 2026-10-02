import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'extended_care.classes:read';

export type Classe = ResponseData<'read_extended_care_classes'>;

/** Read Extended Care: Classes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_extended_care_classes'>): Promise<Classe> {
    const {data,error} = await client().GET('/extended_care/classes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Classe', { cause: error });
    }
    return data.data;
}