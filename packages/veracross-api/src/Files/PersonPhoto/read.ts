import { operations } from '#spec/Files-API.js';
import { client } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'files:person_photo:read';

export type ReadPersonPhoto = ResponseData<operations, 'read_person_photo'>;

/** Read Person Photo */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_person_photo'>): Promise<ReadPersonPhoto> {
    const {data,error} = await client().GET('/person_photo/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonPhoto', { cause: error });
    }
    return data.data;
}