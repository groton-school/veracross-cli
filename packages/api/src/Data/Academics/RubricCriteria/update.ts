import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type RubricCriterionPatch = RequestData<operations, 'update_academics_rubric_criteria'>;

export const UPDATE_SCOPE = 'academics.rubric_criteria:update';

/** Update Academics: Rubric Criteria */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_rubric_criteria'>): Promise<void> {
    const { error } = await client().PATCH('/academics/rubric_criteria/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating RubricCriterion', { cause: error });
    }
}