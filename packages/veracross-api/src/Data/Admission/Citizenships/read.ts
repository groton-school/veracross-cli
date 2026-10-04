import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'admission.citizenships:read';

export type Citizenship = ResponseData<operations, 'read_admission_citizenships'>;

/** Read Admission: Citizenships */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_admission_citizenships'>): Promise<Citizenship> {
    const {data,error} = await client().GET('/admission/citizenships/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Citizenship', { cause: error });
    }
    return data.data;
}