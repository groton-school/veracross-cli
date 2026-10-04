import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'standardized_tests.scores:update';

/** Update Standardized Tests: Scores */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_standardized_tests_scores'>): Promise<void> {
    const { error } = await client().PATCH('/standardized_tests/scores/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Score', { cause: error });
    }
}