import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'admission.languages:read';

export type Language = ResponseData<'read_admission_languages'>;

/** Read Admission: Languages */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_admission_languages'>): Promise<Language> {
    const {data,error} = await client().GET('/admission/languages/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Language', { cause: error });
    }
    return data.data;
}