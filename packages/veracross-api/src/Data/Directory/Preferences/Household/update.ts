import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'directory.preferences.household:update';

/** Update Directory Preferences: Household */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_directory_preferences_household'>): Promise<void> {
    const { error } = await client().PATCH('/directory/preferences/household/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Household', { cause: error });
    }
}