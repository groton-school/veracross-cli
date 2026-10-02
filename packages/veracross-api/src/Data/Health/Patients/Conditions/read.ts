import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'health.patients.conditions:read';

export type PatientCondition = ResponseData<'read_health_patient_conditions'>;

/** Read Health: Patient Conditions */
export async function read({ 
    patient_id, 
    id, 
    ...rest
}: EndpointOptions<'read_health_patient_conditions'>): Promise<PatientCondition> {
    const {data,error} = await client().GET('/health/patients/{patient_id}/conditions/{id}', {
        params: { path: { patient_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving PatientCondition', { cause: error });
    }
    return data.data;
}