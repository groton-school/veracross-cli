import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ScoreTypePatch = RequestData<operations, 'update_standardized_tests_score_types'>;

export const UPDATE_SCOPE = 'standardized_tests.score_types:update';

/** Update Standardized Tests: Score Types */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_standardized_tests_score_types'>): Promise<void> {
    const { error } = await client().PATCH('/standardized_tests/score_types/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ScoreType', { cause: error });
    }
}