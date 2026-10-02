import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'health.patients:update';

/** Update Health: Patients */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_health_patients'>): Promise<void> {
    const { error } = await client().PATCH('/health/patients/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Patient', { cause: error });
    }
}