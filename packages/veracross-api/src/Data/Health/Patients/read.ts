import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'health.patients:read';

export type Patient = ResponseData<'read_health_patients'>;

/** Read Health: Patients */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_health_patients'>): Promise<Patient> {
    const {data,error} = await client().GET('/health/patients/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Patient', { cause: error });
    }
    return data.data;
}