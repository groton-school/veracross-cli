import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type RubricScalesLevelPatch = RequestData<operations, 'update_academics_rubric_scales_levels'>;

export const UPDATE_SCOPE = 'academics.rubric_scale_levels:update';

/** Update Academics: Rubric Scales - Levels */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_rubric_scales_levels'>): Promise<void> {
    const { error } = await client().PATCH('/academics/rubric_scale_levels/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating RubricScalesLevel', { cause: error });
    }
}