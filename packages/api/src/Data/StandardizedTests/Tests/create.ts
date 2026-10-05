import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'standardized_tests.tests:create';

/** Create Standardized Tests: Tests */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_standardized_tests_tests'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/standardized_tests/tests', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Test', { cause: error });
    }
    return id;
}