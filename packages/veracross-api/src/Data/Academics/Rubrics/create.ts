import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.rubrics:create';

/** Create Academics: Rubrics */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_academics_rubrics'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/rubrics', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Rubric', { cause: error });
    }
    return id;
}