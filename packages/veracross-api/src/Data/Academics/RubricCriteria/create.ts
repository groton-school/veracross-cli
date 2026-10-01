import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.rubric_criteria:create';

/** Create Academics: Rubric Criteria */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_academics_rubric_criteria'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/rubric_criteria', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating RubricCriteria', { cause: error });
    }
    return id;
}