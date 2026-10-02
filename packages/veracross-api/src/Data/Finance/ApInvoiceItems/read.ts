import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.ap_invoice_items:read';

export type ApInvoiceItem = ResponseData<'read_finance_ap_invoice_items'>;

/** Read Finance: AP Invoice Items */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_finance_ap_invoice_items'>): Promise<ApInvoiceItem> {
    const {data,error} = await client().GET('/finance/ap_invoice_items/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ApInvoiceItem', { cause: error });
    }
    return data.data;
}