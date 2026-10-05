import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ReservationPatch = RequestData<operations, 'update_resource_reservations_reservations'>;

export const UPDATE_SCOPE = 'resource_reservations.reservations:update';

/** Update Resource Reservations: Reservations */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_resource_reservations_reservations'>): Promise<void> {
    const { error } = await client().PATCH('/resource_reservations/reservations/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Reservation', { cause: error });
    }
}