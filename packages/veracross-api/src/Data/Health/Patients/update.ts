import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'health.patients:update';

/** Update Health: Patients */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_health_patients'>): Promise<void> {
    const { error } = await client().PATCH('/health/patients/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Patient', { cause: error });
    }
}