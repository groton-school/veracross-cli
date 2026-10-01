import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'admission.applicants.relationships:create';

/** Create Admission: Applicant Relationships */
export async function create({ 
    applicant_id,
    data,
    ...rest
}: EndpointOptions<'create_admission_applicant_relationships'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/admission/applicants/{applicant_id}/relationships', {
        params: { path: { applicant_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ApplicantRelationship', { cause: error });
    }
    return id;
}