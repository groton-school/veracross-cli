import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'admission.households:read';

export type Household = ResponseData<'read_admission_households'>;

/** Read Admission: Households */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_admission_households'>): Promise<Household> {
    const {data,error} = await client().GET('/admission/households/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Household', { cause: error });
    }
    return data.data;
}