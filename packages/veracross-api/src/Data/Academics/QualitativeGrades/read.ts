import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.qualitative_grades:read';

export type QualitativeGrade = ResponseData<'read_academics_qualitative_grades'>;

/** Read Academics: Qualitative Grades */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_qualitative_grades'>): Promise<QualitativeGrade> {
    const {data,error} = await client().GET('/academics/qualitative_grades/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving QualitativeGrade', { cause: error });
    }
    return data.data;
}