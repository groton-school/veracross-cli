import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.qualitative_grades:read';

export type QualitativeGrade = ResponseData<operations, 'read_academics_qualitative_grades'>;

/** Read Academics: Qualitative Grades */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_qualitative_grades'>): Promise<QualitativeGrade> {
    const {data,error} = await client().GET('/academics/qualitative_grades/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving QualitativeGrade', { cause: error });
    }
    return data.data;
}