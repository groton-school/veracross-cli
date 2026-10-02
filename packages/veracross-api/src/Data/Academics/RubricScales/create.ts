import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.rubric_scales:create';

/** Create Academics: Rubric Scales */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_academics_rubric_scales'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/rubric_scales', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating RubricScale', { cause: error });
    }
    return id;
}