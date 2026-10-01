import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'standardized_tests.scores:update';

/** Update Standardized Tests: Scores */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_standardized_tests_scores'>): Promise<void> {
    const { error } = await client().PATCH('/standardized_tests/scores/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Score', { cause: error });
    }
}