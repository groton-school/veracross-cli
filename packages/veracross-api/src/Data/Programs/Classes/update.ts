import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'programs.classes:update';

/** Update Programs: Classes */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_programs_classes'>): Promise<void> {
    const { error } = await client().PATCH('/programs/classes/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Classe', { cause: error });
    }
}