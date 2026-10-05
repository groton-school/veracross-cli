import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'admission.config.years:read';

export type ConfigurationYear = ResponseData<operations, 'read_admission_configuration_years'>;

/** Read Admission: Configuration - Years */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_admission_configuration_years'>): Promise<ConfigurationYear> {
    const {data,error} = await client().GET('/admission/config/years/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ConfigurationYear', { cause: error });
    }
    return data.data;
}