import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'admission.applicants.relationships:read';

export type ApplicantRelationship = ResponseData<'read_admission_applicant_relationships'>;

/** Read Admission: Applicant Relationships */
export async function read({ 
    applicant_id, 
    id, 
    ...rest
}: EndpointOptions<'read_admission_applicant_relationships'>): Promise<ApplicantRelationship> {
    const {data,error} = await client().GET('/admission/applicants/{applicant_id}/relationships/{id}', {
        params: { path: { applicant_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ApplicantRelationship', { cause: error });
    }
    return data.data;
}