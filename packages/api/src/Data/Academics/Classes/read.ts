import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.classes:read';

export type Class = ResponseData<operations, 'read_academics_classes'>;

/** Read Academics: Classes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_classes'>): Promise<Class> {
    const {data,error} = await client().GET('/academics/classes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Class', { cause: error });
    }
    return data.data;
}