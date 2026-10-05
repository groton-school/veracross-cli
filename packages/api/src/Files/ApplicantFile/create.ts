import { operations } from '#spec/Files-API.js';
import { client } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'files:applicant_file:create';

/** Create Admissions: Applicant Files */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_admissions_applicant_files'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/applicant_file', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ApplicantFile', { cause: error });
    }
    return id;
}