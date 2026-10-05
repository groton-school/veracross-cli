import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'resource_reservations.reservations:read';

export type Reservation = ResponseData<operations, 'read_resource_reservations_reservations'>;

/** Read Resource Reservations: Reservations */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_resource_reservations_reservations'>): Promise<Reservation> {
    const {data,error} = await client().GET('/resource_reservations/reservations/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Reservation', { cause: error });
    }
    return data.data;
}