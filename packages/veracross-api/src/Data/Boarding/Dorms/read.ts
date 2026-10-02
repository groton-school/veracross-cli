import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'boarding.dorms:read';

export type Dorm = ResponseData<'read_boarding_dorms'>;

/** Read Boarding: Dorms */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_boarding_dorms'>): Promise<Dorm> {
    const {data,error} = await client().GET('/boarding/dorms/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Dorm', { cause: error });
    }
    return data.data;
}