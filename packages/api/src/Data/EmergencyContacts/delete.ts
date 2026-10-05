import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'emergency_contacts:delete';

/** Delete Emergency Contacts */
export async function delete_({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_emergency_contacts'>): Promise<void> {
    const { error } = await client().DELETE('/emergency_contacts/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting DeleteEmergencyContact', { cause: error });
    }
}