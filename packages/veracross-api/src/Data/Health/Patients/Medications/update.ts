import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type PatientMedicationPatch = RequestData<operations, 'update_health_patient_medications'>;

export const UPDATE_SCOPE = 'health.patients.medications:update';

/** Update Health: Patient Medications */
export async function update({ 
    patient_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_health_patient_medications'>): Promise<void> {
    const { error } = await client().PATCH('/health/patients/{patient_id}/medications/{id}', {
        params: { path: { patient_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating PatientMedication', { cause: error });
    }
}