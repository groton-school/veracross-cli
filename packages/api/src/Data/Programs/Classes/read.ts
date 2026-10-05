import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'programs.classes:read';

export type Class = ResponseData<operations, 'read_programs_classes'>;

/** Read Programs: Classes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_programs_classes'>): Promise<Class> {
    const {data,error} = await client().GET('/programs/classes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Class', { cause: error });
    }
    return data.data;
}