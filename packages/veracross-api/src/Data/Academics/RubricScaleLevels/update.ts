import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.rubric_scale_levels:update';

/** Update Academics: Rubric Scales - Levels */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_rubric_scales_levels'>): Promise<void> {
    const { error } = await client().PATCH('/academics/rubric_scale_levels/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating RubricScalesLevel', { cause: error });
    }
}