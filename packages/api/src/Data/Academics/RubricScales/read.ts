import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubric_scales:read';

export type RubricScale = ResponseData<operations, 'read_academics_rubric_scales'>;

/** Read Academics: Rubric Scales */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_rubric_scales'>): Promise<RubricScale> {
    const {data,error} = await client().GET('/academics/rubric_scales/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RubricScale', { cause: error });
    }
    return data.data;
}