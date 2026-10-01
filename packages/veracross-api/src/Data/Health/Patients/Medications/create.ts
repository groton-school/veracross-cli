import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'health.patients.medications:create';

/** Create Health: Patient Medications */
export async function create({ 
    patient_id,
    data,
    ...rest
}: EndpointOptions<'create_health_patient_medications'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/health/patients/{patient_id}/medications', {
        params: { path: { patient_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating PatientMedication', { cause: error });
    }
    return id;
}