import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'report_card.enrollments.qualitative_grades:read';

export type QualitativeGrade = ResponseData<'read_report_cards_qualitative_grades'>;

/** Read Report Cards: Qualitative Grades */
export async function read({ 
    enrollment_id, 
    id, 
    ...rest
}: EndpointOptions<'read_report_cards_qualitative_grades'>): Promise<QualitativeGrade> {
    const {data,error} = await client().GET('/report_card/enrollments/{enrollment_id}/qualitative_grades/{id}', {
        params: { path: { enrollment_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving QualitativeGrade', { cause: error });
    }
    return data.data;
}