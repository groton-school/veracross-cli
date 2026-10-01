import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'extended_care.registrations:read';

export type Registration = ResponseData<'read_extended_care_registrations'>;

/** Read Extended Care: Registrations */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_extended_care_registrations'>): Promise<Registration> {
    const {data,error} = await client().GET('/extended_care/registrations/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Registration', { cause: error });
    }
    return data.data;
}