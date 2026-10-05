import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ApplicationChecklistPatch = RequestData<operations, 'update_admission_application_checklists'>;

export const UPDATE_SCOPE = 'admission.applications.checklists:update';

/** Update Admission: Application Checklists */
export async function update({ 
    application_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_application_checklists'>): Promise<void> {
    const { error } = await client().PATCH('/admission/applications/{application_id}/checklists/{id}', {
        params: { path: { application_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ApplicationChecklist', { cause: error });
    }
}