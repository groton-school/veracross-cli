import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'standardized_tests.score_types:create';

/** Create Standardized Tests: Score Types */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_standardized_tests_score_types'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/standardized_tests/score_types', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ScoreType', { cause: error });
    }
    return id;
}