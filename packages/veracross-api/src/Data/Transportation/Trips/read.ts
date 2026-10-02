import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'transportation.trips:read';

export type Trip = ResponseData<'read_transportation_trips'>;

/** Read Transportation: Trips */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_transportation_trips'>): Promise<Trip> {
    const {data,error} = await client().GET('/transportation/trips/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Trip', { cause: error });
    }
    return data.data;
}