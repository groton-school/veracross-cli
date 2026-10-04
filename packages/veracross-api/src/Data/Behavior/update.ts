import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'behavior:update';

/** Update Behavior */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_behavior'>): Promise<void> {
    const { error } = await client().PATCH('/behavior/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateBehavior', { cause: error });
    }
}