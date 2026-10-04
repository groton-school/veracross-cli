import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'report_card.classes.curriculum:read';

export type ClassCurriculum = ResponseData<operations, 'read_report_cards_class_curriculum'>;

/** Read Report Cards: Class Curriculum */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_report_cards_class_curriculum'>): Promise<ClassCurriculum> {
    const {data,error} = await client().GET('/report_card/classes/{internal_class_id}/curriculum/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassCurriculum', { cause: error });
    }
    return data.data;
}