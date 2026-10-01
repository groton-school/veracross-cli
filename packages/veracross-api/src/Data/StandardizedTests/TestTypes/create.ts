import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'standardized_tests.test_types:create';

/** Create Standardized Tests: Test Types */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_standardized_tests_test_types'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/standardized_tests/test_types', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating TestType', { cause: error });
    }
    return id;
}