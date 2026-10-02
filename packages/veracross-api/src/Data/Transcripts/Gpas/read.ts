import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'transcripts.gpas:read';

export type GpA = ResponseData<'read_transcripts_gpas'>;

/** Read Transcripts: GPAs */
export async function read({ 
    person_id, 
    id, 
    ...rest
}: EndpointOptions<'read_transcripts_gpas'>): Promise<GpA> {
    const {data,error} = await client().GET('/transcripts/{person_id}/gpas/{id}', {
        params: { path: { person_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving GpA', { cause: error });
    }
    return data.data;
}