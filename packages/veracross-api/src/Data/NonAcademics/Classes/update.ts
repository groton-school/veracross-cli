import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'non-academics.classes:update';

/** Update Non-Academics: Classes */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_non_academics_classes'>): Promise<void> {
    const { error } = await client().PATCH('/non-academics/classes/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Classe', { cause: error });
    }
}