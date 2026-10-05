import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'report_card.enrollments:read';

export type Enrollment = ResponseData<operations, 'read_report_cards_enrollments'>;

/** Read Report Cards: Enrollments */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_report_cards_enrollments'>): Promise<Enrollment> {
    const {data,error} = await client().GET('/report_card/enrollments/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Enrollment', { cause: error });
    }
    return data.data;
}