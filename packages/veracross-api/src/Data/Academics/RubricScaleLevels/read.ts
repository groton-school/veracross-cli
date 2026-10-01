import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'academics.rubric_scale_levels:read';

export type RubricScalesLevel = ResponseData<'read_academics_rubric_scales_levels'>;

/** Read Academics: Rubric Scales - Levels */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_rubric_scales_levels'>): Promise<RubricScalesLevel> {
    const {data,error} = await client().GET('/academics/rubric_scale_levels/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RubricScalesLevel', { cause: error });
    }
    return data.data;
}