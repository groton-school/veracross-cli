import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'admission.applications:read';

export type Application = ResponseData<operations, 'read_admission_applications'>;

/** Read Admission: Applications */
export async function read({ 
    application_id, 
    ...rest
}: EndpointOptions<operations, 'read_admission_applications'>): Promise<Application> {
    const {data,error} = await client().GET('/admission/applications/{application_id}', {
        params: { path: { application_id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Application', { cause: error });
    }
    return data.data;
}