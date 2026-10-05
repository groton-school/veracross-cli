import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ApplicantPatch = RequestData<operations, 'update_admission_applicants'>;

export const UPDATE_SCOPE = 'admission.applicants:update';

/** Update Admission: Applicants */
export async function update({ 
    applicant_id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_applicants'>): Promise<void> {
    const { error } = await client().PATCH('/admission/applicants/{applicant_id}', {
        params: { path: { applicant_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Applicant', { cause: error });
    }
}