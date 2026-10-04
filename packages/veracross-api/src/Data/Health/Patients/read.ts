import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'health.patients:read';

export type Patient = ResponseData<operations, 'read_health_patients'>;

/** Read Health: Patients */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_health_patients'>): Promise<Patient> {
    const {data,error} = await client().GET('/health/patients/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Patient', { cause: error });
    }
    return data.data;
}