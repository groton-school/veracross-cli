import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'transcripts.academic_classifications:read';

export type AcademicClassification = ResponseData<'read_transcripts_academic_classifications'>;

/** Read Transcripts: Academic Classifications */
export async function read({ 
    person_id, 
    id, 
    ...rest
}: EndpointOptions<'read_transcripts_academic_classifications'>): Promise<AcademicClassification> {
    const {data,error} = await client().GET('/transcripts/{person_id}/academic_classifications/{id}', {
        params: { path: { person_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving AcademicClassification', { cause: error });
    }
    return data.data;
}