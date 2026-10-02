import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubrics:read';

export type Rubric = ResponseData<'read_academics_rubrics'>;

/** Read Academics: Rubrics */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_rubrics'>): Promise<Rubric> {
    const {data,error} = await client().GET('/academics/rubrics/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Rubric', { cause: error });
    }
    return data.data;
}