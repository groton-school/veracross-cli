import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type RubricCategoryPatch = RequestData<operations, 'update_academics_rubric_categories'>;

export const UPDATE_SCOPE = 'academics.rubric_categories:update';

/** Update Academics: Rubric Categories */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_rubric_categories'>): Promise<void> {
    const { error } = await client().PATCH('/academics/rubric_categories/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating RubricCategory', { cause: error });
    }
}