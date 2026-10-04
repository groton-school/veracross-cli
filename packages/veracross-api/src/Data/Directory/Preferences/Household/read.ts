import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'directory.preferences.household:read';

export type Household = ResponseData<operations, 'read_directory_preferences_household'>;

/** Read Directory Preferences: Household */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_directory_preferences_household'>): Promise<Household> {
    const {data,error} = await client().GET('/directory/preferences/household/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Household', { cause: error });
    }
    return data.data;
}