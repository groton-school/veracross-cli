import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'transportation.bus_stops:read';

export type BusStop = ResponseData<'read_transportation_bus_stops'>;

/** Read Transportation: Bus Stops */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_transportation_bus_stops'>): Promise<BusStop> {
    const {data,error} = await client().GET('/transportation/bus_stops/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving BusStop', { cause: error });
    }
    return data.data;
}