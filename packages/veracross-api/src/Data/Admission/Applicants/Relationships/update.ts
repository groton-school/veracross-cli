import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ApplicantRelationshipPatch = RequestData<operations, 'update_admission_applicant_relationships'>;

export const UPDATE_SCOPE = 'admission.applicants.relationships:update';

/** Update Admission: Applicant Relationships */
export async function update({ 
    applicant_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_applicant_relationships'>): Promise<void> {
    const { error } = await client().PATCH('/admission/applicants/{applicant_id}/relationships/{id}', {
        params: { path: { applicant_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ApplicantRelationship', { cause: error });
    }
}