import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type RubricScalePatch = RequestData<operations, 'update_academics_rubric_scales'>;

export const UPDATE_SCOPE = 'academics.rubric_scales:update';

/** Update Academics: Rubric Scales */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_rubric_scales'>): Promise<void> {
    const { error } = await client().PATCH('/academics/rubric_scales/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating RubricScale', { cause: error });
    }
}