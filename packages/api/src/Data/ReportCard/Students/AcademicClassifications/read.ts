import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'report_card.students.academic_classifications:read';

export type AcademicClassification = ResponseData<operations, 'read_report_cards_academic_classifications'>;

/** Read Report Cards: Academic Classifications */
export async function read({ 
    person_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_report_cards_academic_classifications'>): Promise<AcademicClassification> {
    const {data,error} = await client().GET('/report_card/students/{person_id}/academic_classifications/{id}', {
        params: { path: { person_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving AcademicClassification', { cause: error });
    }
    return data.data;
}