import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.rubrics:update';

/** Update Academics: Rubrics */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_rubrics'>): Promise<void> {
    const { error } = await client().PATCH('/academics/rubrics/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Rubric', { cause: error });
    }
}