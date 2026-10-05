import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ResourcePatch = RequestData<operations, 'update_resource_reservations_resources'>;

export const UPDATE_SCOPE = 'resource_reservations.resources:update';

/** Update Resource Reservations: Resources */
export async function update({ 
    resource_id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_resource_reservations_resources'>): Promise<void> {
    const { error } = await client().PATCH('/resource_reservations/resources/{resource_id}', {
        params: { path: { resource_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Resource', { cause: error });
    }
}