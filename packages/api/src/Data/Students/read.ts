import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'students:read';

export type ReadStudent = ResponseData<operations, 'read_students'>;

/** Read Students */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_students'>): Promise<ReadStudent> {
    const {data,error} = await client().GET('/students/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadStudent', { cause: error });
    }
    return data.data;
}