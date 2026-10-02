import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'resource_reservations.reservations:create';

/** Create Resource Reservations: Reservations */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_resource_reservations_reservations'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/resource_reservations/reservations', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Reservation', { cause: error });
    }
    return id;
}