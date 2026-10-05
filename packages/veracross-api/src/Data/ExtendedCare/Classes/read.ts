import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'extended_care.classes:read';

export type Class = ResponseData<operations, 'read_extended_care_classes'>;

/** Read Extended Care: Classes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_extended_care_classes'>): Promise<Class> {
    const {data,error} = await client().GET('/extended_care/classes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Class', { cause: error });
    }
    return data.data;
}