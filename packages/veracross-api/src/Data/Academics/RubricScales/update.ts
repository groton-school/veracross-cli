import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.rubric_scales:update';

/** Update Academics: Rubric Scales */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_rubric_scales'>): Promise<void> {
    const { error } = await client().PATCH('/academics/rubric_scales/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating RubricScale', { cause: error });
    }
}