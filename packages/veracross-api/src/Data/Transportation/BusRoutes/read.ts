import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'transportation.bus_routes:read';

export type BusRoute = ResponseData<'read_transportation_bus_routes'>;

/** Read Transportation: Bus Routes */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_transportation_bus_routes'>): Promise<BusRoute> {
    const {data,error} = await client().GET('/transportation/bus_routes/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving BusRoute', { cause: error });
    }
    return data.data;
}