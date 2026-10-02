import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'standardized_tests.score_types:read';

export type ScoreType = ResponseData<'read_standardized_tests_score_types'>;

/** Read Standardized Tests: Score Types */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_standardized_tests_score_types'>): Promise<ScoreType> {
    const {data,error} = await client().GET('/standardized_tests/score_types/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ScoreType', { cause: error });
    }
    return data.data;
}