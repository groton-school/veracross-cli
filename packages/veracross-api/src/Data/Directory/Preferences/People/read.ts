import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'directory.preferences.people:read';

export type Person = ResponseData<'read_directory_preferences_person'>;

/** Read Directory Preferences: Person */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_directory_preferences_person'>): Promise<Person> {
    const {data,error} = await client().GET('/directory/preferences/people/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Person', { cause: error });
    }
    return data.data;
}