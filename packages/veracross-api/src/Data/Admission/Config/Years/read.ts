import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'admission.config.years:read';

export type ConfigurationYear = ResponseData<'read_admission_configuration_years'>;

/** Read Admission: Configuration - Years */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_admission_configuration_years'>): Promise<ConfigurationYear> {
    const {data,error} = await client().GET('/admission/config/years/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ConfigurationYear', { cause: error });
    }
    return data.data;
}