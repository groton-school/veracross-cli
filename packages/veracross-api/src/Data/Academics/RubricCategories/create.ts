import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.rubric_categories:create';

/** Create Academics: Rubric Categories */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_academics_rubric_categories'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/rubric_categories', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating RubricCategory', { cause: error });
    }
    return id;
}