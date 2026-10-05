import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'person_reference_number:read';

export type ReadPersonReferenceNumber = ResponseData<operations, 'read_person_reference_number'>;

/** Read Person Reference Number */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_person_reference_number'>): Promise<ReadPersonReferenceNumber> {
    const {data,error} = await client().GET('/person_reference_number/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonReferenceNumber', { cause: error });
    }
    return data.data;
}