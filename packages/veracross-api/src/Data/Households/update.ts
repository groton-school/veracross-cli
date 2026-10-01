import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'households:update';

/** Update Households */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_households'>): Promise<void> {
    const { error } = await client().PATCH('/households/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateHousehold', { cause: error });
    }
}