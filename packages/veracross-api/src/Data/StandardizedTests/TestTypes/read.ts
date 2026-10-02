import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'standardized_tests.test_types:read';

export type TestType = ResponseData<'read_standardized_tests_test_types'>;

/** Read Standardized Tests: Test Types */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_standardized_tests_test_types'>): Promise<TestType> {
    const {data,error} = await client().GET('/standardized_tests/test_types/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving TestType', { cause: error });
    }
    return data.data;
}