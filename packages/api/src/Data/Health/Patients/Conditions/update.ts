import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type PatientConditionPatch = RequestData<operations, 'update_health_patient_conditions'>;

export const UPDATE_SCOPE = 'health.patients.conditions:update';

/** Update Health: Patient Conditions */
export async function update({ 
    patient_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_health_patient_conditions'>): Promise<void> {
    const { error } = await client().PATCH('/health/patients/{patient_id}/conditions/{id}', {
        params: { path: { patient_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating PatientCondition', { cause: error });
    }
}