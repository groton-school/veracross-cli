import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'standardized_tests.tests:update';

/** Update Standardized Tests: Tests */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_standardized_tests_tests'>): Promise<void> {
    const { error } = await client().PATCH('/standardized_tests/tests/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Test', { cause: error });
    }
}