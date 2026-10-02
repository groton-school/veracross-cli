import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'standardized_tests.scores:read';

export type Score = ResponseData<'read_standardized_tests_scores'>;

/** Read Standardized Tests: Scores */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_standardized_tests_scores'>): Promise<Score> {
    const {data,error} = await client().GET('/standardized_tests/scores/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Score', { cause: error });
    }
    return data.data;
}