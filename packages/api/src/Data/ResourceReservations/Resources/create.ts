import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'resource_reservations.resources:create';

/** Create Resource Reservations: Resources */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_resource_reservations_resources'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/resource_reservations/resources', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Resource', { cause: error });
    }
    return id;
}