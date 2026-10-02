import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubric_categories:read';

export type RubricCategorie = ResponseData<'read_academics_rubric_categories'>;

/** Read Academics: Rubric Categories */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_rubric_categories'>): Promise<RubricCategorie> {
    const {data,error} = await client().GET('/academics/rubric_categories/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RubricCategorie', { cause: error });
    }
    return data.data;
}