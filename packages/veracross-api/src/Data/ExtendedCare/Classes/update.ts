import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'extended_care.classes:update';

/** Update Extended Care: Classes */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_extended_care_classes'>): Promise<void> {
    const { error } = await client().PATCH('/extended_care/classes/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Classe', { cause: error });
    }
}