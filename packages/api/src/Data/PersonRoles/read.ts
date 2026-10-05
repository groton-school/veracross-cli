import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'person_roles:read';

export type ReadPersonRole = ResponseData<operations, 'read_person_roles'>;

/** Read Person Roles */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_person_roles'>): Promise<ReadPersonRole> {
    const {data,error} = await client().GET('/person_roles/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonRole', { cause: error });
    }
    return data.data;
}