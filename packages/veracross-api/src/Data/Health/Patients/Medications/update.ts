import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'health.patients.medications:update';

/** Update Health: Patient Medications */
export async function update({ 
    patient_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_health_patient_medications'>): Promise<void> {
    const { error } = await client().PATCH('/health/patients/{patient_id}/medications/{id}', {
        params: { path: { patient_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating PatientMedication', { cause: error });
    }
}