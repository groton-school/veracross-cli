import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'standardized_tests.tests:read';

export type Test = ResponseData<'read_standardized_tests_tests'>;

/** Read Standardized Tests: Tests */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_standardized_tests_tests'>): Promise<Test> {
    const {data,error} = await client().GET('/standardized_tests/tests/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Test', { cause: error });
    }
    return data.data;
}