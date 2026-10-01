import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'person_visas:update';

/** Update Person Visas */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_person_visas'>): Promise<void> {
    const { error } = await client().PATCH('/person_visas/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdatePersonVisa', { cause: error });
    }
}