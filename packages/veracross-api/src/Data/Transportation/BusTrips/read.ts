import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'transportation.bus_trips:read';

export type BusTrip = ResponseData<operations, 'read_transportation_bus_trips'>;

/** Read Transportation: Bus Trips */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_transportation_bus_trips'>): Promise<BusTrip> {
    const {data,error} = await client().GET('/transportation/bus_trips/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving BusTrip', { cause: error });
    }
    return data.data;
}