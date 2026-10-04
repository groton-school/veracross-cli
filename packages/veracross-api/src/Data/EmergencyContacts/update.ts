import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'emergency_contacts:update';

/** Update Emergency Contacts */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_emergency_contacts'>): Promise<void> {
    const { error } = await client().PATCH('/emergency_contacts/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateEmergencyContact', { cause: error });
    }
}