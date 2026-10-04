import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'person_profile_codes:read';

export type ReadPersonProfileCode = ResponseData<operations, 'read_person_profile_codes'>;

/** Read Person Profile Codes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_person_profile_codes'>): Promise<ReadPersonProfileCode> {
    const {data,error} = await client().GET('/person_profile_codes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonProfileCode', { cause: error });
    }
    return data.data;
}