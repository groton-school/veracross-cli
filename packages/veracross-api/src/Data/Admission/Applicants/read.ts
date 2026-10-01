import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'admission.applicants:read';

export type Applicant = ResponseData<'read_admission_applicants'>;

/** Read Admission: Applicants */
export async function read({ 
    applicant_id, 
    ...rest
}: EndpointOptions<'read_admission_applicants'>): Promise<Applicant> {
    const {data,error} = await client().GET('/admission/applicants/{applicant_id}', {
        params: { path: { applicant_id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Applicant', { cause: error });
    }
    return data.data;
}