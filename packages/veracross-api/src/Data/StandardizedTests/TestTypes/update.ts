import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'standardized_tests.test_types:update';

/** Update Standardized Tests: Test Types */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_standardized_tests_test_types'>): Promise<void> {
    const { error } = await client().PATCH('/standardized_tests/test_types/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating TestType', { cause: error });
    }
}