import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubric_criteria:read';

export type RubricCriteria = ResponseData<operations, 'read_academics_rubric_criteria'>;

/** Read Academics: Rubric Criteria */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_rubric_criteria'>): Promise<RubricCriteria> {
    const {data,error} = await client().GET('/academics/rubric_criteria/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RubricCriteria', { cause: error });
    }
    return data.data;
}