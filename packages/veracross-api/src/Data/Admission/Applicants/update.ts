import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.applicants:update';

/** Update Admission: Applicants */
export async function update({ 
    applicant_id, 
    data,
    ...rest
}: EndpointOptions<'update_admission_applicants'>): Promise<void> {
    const { error } = await client().PATCH('/admission/applicants/{applicant_id}', {
        params: { path: { applicant_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Applicant', { cause: error });
    }
}