import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubric_criteria:read';

export type RubricCriteria = ResponseData<'read_academics_rubric_criteria'>;

/** Read Academics: Rubric Criteria */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_rubric_criteria'>): Promise<RubricCriteria> {
    const {data,error} = await client().GET('/academics/rubric_criteria/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RubricCriteria', { cause: error });
    }
    return data.data;
}