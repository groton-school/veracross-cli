import { operations } from '#spec/Files-API.js';
import { client } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'files:applicant_file:read';

export type ApplicantFile = ResponseData<operations, 'read_admissions_applicant_files'>;

/** Read Admissions: Applicant Files */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_admissions_applicant_files'>): Promise<ApplicantFile> {
    const {data,error} = await client().GET('/applicant_file/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ApplicantFile', { cause: error });
    }
    return data.data;
}