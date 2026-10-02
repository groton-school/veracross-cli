import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'report_card.enrollments.numeric_grades:read';

export type NumericGrade = ResponseData<'read_report_cards_numeric_grades'>;

/** Read Report Cards: Numeric Grades */
export async function read({ 
    enrollment_id, 
    id, 
    ...rest
}: EndpointOptions<'read_report_cards_numeric_grades'>): Promise<NumericGrade> {
    const {data,error} = await client().GET('/report_card/enrollments/{enrollment_id}/numeric_grades/{id}', {
        params: { path: { enrollment_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving NumericGrade', { cause: error });
    }
    return data.data;
}