import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'health.patients.medications:read';

export type PatientMedication = ResponseData<'read_health_patient_medications'>;

/** Read Health: Patient Medications */
export async function read({ 
    patient_id, 
    id, 
    ...rest
}: EndpointOptions<'read_health_patient_medications'>): Promise<PatientMedication> {
    const {data,error} = await client().GET('/health/patients/{patient_id}/medications/{id}', {
        params: { path: { patient_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving PatientMedication', { cause: error });
    }
    return data.data;
}