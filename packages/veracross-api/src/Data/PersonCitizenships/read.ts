import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'person_citizenships:read';

export type ReadPersonCitizenship = ResponseData<'read_person_citizenships'>;

/** Read Person Citizenships */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_person_citizenships'>): Promise<ReadPersonCitizenship> {
    const {data,error} = await client().GET('/person_citizenships/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonCitizenship', { cause: error });
    }
    return data.data;
}