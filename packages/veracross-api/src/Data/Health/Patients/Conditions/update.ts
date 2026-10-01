import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'health.patients.conditions:update';

/** Update Health: Patient Conditions */
export async function update({ 
    patient_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_health_patient_conditions'>): Promise<void> {
    const { error } = await client().PATCH('/health/patients/{patient_id}/conditions/{id}', {
        params: { path: { patient_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating PatientCondition', { cause: error });
    }
}