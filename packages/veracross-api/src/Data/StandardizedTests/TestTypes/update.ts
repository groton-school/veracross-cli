import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type TestTypePatch = RequestData<operations, 'update_standardized_tests_test_types'>;

export const UPDATE_SCOPE = 'standardized_tests.test_types:update';

/** Update Standardized Tests: Test Types */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_standardized_tests_test_types'>): Promise<void> {
    const { error } = await client().PATCH('/standardized_tests/test_types/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating TestType', { cause: error });
    }
}