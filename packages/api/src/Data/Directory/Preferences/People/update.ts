import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type PersonPatch = RequestData<operations, 'update_directory_preferences_person'>;

export const UPDATE_SCOPE = 'directory.preferences.people:update';

/** Update Directory Preferences: Person */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_directory_preferences_person'>): Promise<void> {
    const { error } = await client().PATCH('/directory/preferences/people/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Person', { cause: error });
    }
}