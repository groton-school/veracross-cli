import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.rubric_criteria:update';

/** Update Academics: Rubric Criteria */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_rubric_criteria'>): Promise<void> {
    const { error } = await client().PATCH('/academics/rubric_criteria/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating RubricCriteria', { cause: error });
    }
}