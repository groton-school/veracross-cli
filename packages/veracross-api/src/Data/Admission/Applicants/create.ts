import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'admission.applicants:create';

/** Create Admission: Applicants */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_admission_applicants'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/admission/applicants', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Applicant', { cause: error });
    }
    return id;
}