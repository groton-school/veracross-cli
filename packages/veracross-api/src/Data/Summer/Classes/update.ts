import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'summer.classes:update';

/** Update Summer: Classes */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_summer_classes'>): Promise<void> {
    const { error } = await client().PATCH('/summer/classes/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Classe', { cause: error });
    }
}