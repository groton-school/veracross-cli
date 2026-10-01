import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.applicants.relationships:update';

/** Update Admission: Applicant Relationships */
export async function update({ 
    applicant_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_admission_applicant_relationships'>): Promise<void> {
    const { error } = await client().PATCH('/admission/applicants/{applicant_id}/relationships/{id}', {
        params: { path: { applicant_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ApplicantRelationship', { cause: error });
    }
}