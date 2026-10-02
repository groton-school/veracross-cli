import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'admission.applications.checklists:read';

export type ApplicationChecklist = ResponseData<'read_admission_application_checklists'>;

/** Read Admission: Application Checklists */
export async function read({ 
    application_id, 
    id, 
    ...rest
}: EndpointOptions<'read_admission_application_checklists'>): Promise<ApplicationChecklist> {
    const {data,error} = await client().GET('/admission/applications/{application_id}/checklists/{id}', {
        params: { path: { application_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ApplicationChecklist', { cause: error });
    }
    return data.data;
}