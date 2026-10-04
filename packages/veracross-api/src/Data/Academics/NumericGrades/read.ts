import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.numeric_grades:read';

export type NumericGrade = ResponseData<operations, 'read_academics_numeric_grades'>;

/** Read Academics: Numeric Grades */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_numeric_grades'>): Promise<NumericGrade> {
    const {data,error} = await client().GET('/academics/numeric_grades/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving NumericGrade', { cause: error });
    }
    return data.data;
}