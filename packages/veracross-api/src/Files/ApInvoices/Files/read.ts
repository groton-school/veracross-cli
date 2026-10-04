import { operations } from '#spec/Files-API.js';
import { client } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'files:ap_invoices.files:read';

export type APInvoiceFile = ResponseData<operations, 'read_finance_ap_invoice_files'>;

/** Read Finance: AP Invoice Files */
export async function read({ 
    invoice_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_finance_ap_invoice_files'>): Promise<APInvoiceFile> {
    const {data,error} = await client().GET('/ap_invoices/{invoice_id}/files/{id}', {
        params: { path: { invoice_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving APInvoiceFile', { cause: error });
    }
    return data.data;
}