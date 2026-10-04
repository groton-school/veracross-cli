import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'emergency_contacts:create';

/** Create Emergency Contacts */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_emergency_contacts'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/emergency_contacts', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateEmergencyContact', { cause: error });
    }
    return id;
}