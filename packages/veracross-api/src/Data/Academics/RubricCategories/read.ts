import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubric_categories:read';

export type RubricCategorie = ResponseData<operations, 'read_academics_rubric_categories'>;

/** Read Academics: Rubric Categories */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_rubric_categories'>): Promise<RubricCategorie> {
    const {data,error} = await client().GET('/academics/rubric_categories/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RubricCategorie', { cause: error });
    }
    return data.data;
}