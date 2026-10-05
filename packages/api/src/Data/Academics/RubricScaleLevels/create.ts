import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.rubric_scale_levels:create';

/** Create Academics: Rubric Scales - Levels */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_academics_rubric_scales_levels'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/rubric_scale_levels', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating RubricScalesLevel', { cause: error });
    }
    return id;
}