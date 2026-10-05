import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'report_card.classes.teachers:read';

export type ClassTeacher = ResponseData<operations, 'read_report_cards_class_teachers'>;

/** Read Report Cards: Class Teachers */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_report_cards_class_teachers'>): Promise<ClassTeacher> {
    const {data,error} = await client().GET('/report_card/classes/{internal_class_id}/teachers/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassTeacher', { cause: error });
    }
    return data.data;
}