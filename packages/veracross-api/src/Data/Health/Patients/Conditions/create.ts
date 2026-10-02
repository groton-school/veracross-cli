import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'health.patients.conditions:create';

/** Create Health: Patient Conditions */
export async function create({ 
    patient_id,
    data,
    ...rest
}: EndpointOptions<'create_health_patient_conditions'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/health/patients/{patient_id}/conditions', {
        params: { path: { patient_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating PatientCondition', { cause: error });
    }
    return id;
}