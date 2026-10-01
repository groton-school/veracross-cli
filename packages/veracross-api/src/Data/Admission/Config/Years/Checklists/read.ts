import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'admission.config.years.checklists:read';

export type ConfigurationChecklist = ResponseData<'read_admission_configuration_checklists'>;

/** Read Admission: Configuration - Checklists */
export async function read({ 
    school_year, 
    id, 
    ...rest
}: EndpointOptions<'read_admission_configuration_checklists'>): Promise<ConfigurationChecklist> {
    const {data,error} = await client().GET('/admission/config/years/{school_year}/checklists/{id}', {
        params: { path: { school_year, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ConfigurationChecklist', { cause: error });
    }
    return data.data;
}