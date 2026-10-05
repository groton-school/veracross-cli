import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'transcripts.student_info:read';

export type StudentInformation = ResponseData<operations, 'read_transcripts_student_information'>;

/** Read Transcripts: Student Information */
export async function read({ 
    person_id, 
    ...rest
}: EndpointOptions<operations, 'read_transcripts_student_information'>): Promise<StudentInformation> {
    const {data,error} = await client().GET('/transcripts/student_info/{person_id}', {
        params: { path: { person_id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving StudentInformation', { cause: error });
    }
    return data.data;
}