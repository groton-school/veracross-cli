import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'report_card.students.gpas:read';

export type GpA = ResponseData<'read_report_cards_gpas'>;

/** Read Report Cards: GPAs */
export async function read({ 
    person_id, 
    id, 
    ...rest
}: EndpointOptions<'read_report_cards_gpas'>): Promise<GpA> {
    const {data,error} = await client().GET('/report_card/students/{person_id}/gpas/{id}', {
        params: { path: { person_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving GpA', { cause: error });
    }
    return data.data;
}