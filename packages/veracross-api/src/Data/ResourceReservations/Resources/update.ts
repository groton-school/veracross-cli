import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'resource_reservations.resources:update';

/** Update Resource Reservations: Resources */
export async function update({ 
    resource_id, 
    data,
    ...rest
}: EndpointOptions<'update_resource_reservations_resources'>): Promise<void> {
    const { error } = await client().PATCH('/resource_reservations/resources/{resource_id}', {
        params: { path: { resource_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Resource', { cause: error });
    }
}