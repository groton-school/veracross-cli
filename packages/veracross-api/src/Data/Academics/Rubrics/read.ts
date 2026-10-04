import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubrics:read';

export type Rubric = ResponseData<operations, 'read_academics_rubrics'>;

/** Read Academics: Rubrics */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_rubrics'>): Promise<Rubric> {
    const {data,error} = await client().GET('/academics/rubrics/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Rubric', { cause: error });
    }
    return data.data;
}