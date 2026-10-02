import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'report_card.documents:read';

export type Document = ResponseData<'read_report_cards_documents'>;

/** Read Report Cards: Documents */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_report_cards_documents'>): Promise<Document> {
    const {data,error} = await client().GET('/report_card/documents/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Document', { cause: error });
    }
    return data.data;
}