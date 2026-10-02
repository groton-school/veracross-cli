import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'admission.relatives:read';

export type Relative = ResponseData<'read_admission_relatives'>;

/** Read Admission: Relatives */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_admission_relatives'>): Promise<Relative> {
    const {data,error} = await client().GET('/admission/relatives/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Relative', { cause: error });
    }
    return data.data;
}