import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubric_categories:read';

export type RubricCategory = ResponseData<operations, 'read_academics_rubric_categories'>;

/** Read Academics: Rubric Categories */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_rubric_categories'>): Promise<RubricCategory> {
    const {data,error} = await client().GET('/academics/rubric_categories/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RubricCategory', { cause: error });
    }
    return data.data;
}