import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'emergency_contacts:read';

export type ReadEmergencyContact = ResponseData<operations, 'read_emergency_contacts'>;

/** Read Emergency Contacts */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_emergency_contacts'>): Promise<ReadEmergencyContact> {
    const {data,error} = await client().GET('/emergency_contacts/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadEmergencyContact', { cause: error });
    }
    return data.data;
}