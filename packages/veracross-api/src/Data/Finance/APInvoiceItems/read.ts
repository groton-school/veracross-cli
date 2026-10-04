import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.ap_invoice_items:read';

export type APInvoiceItem = ResponseData<operations, 'read_finance_ap_invoice_items'>;

/** Read Finance: AP Invoice Items */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_finance_ap_invoice_items'>): Promise<APInvoiceItem> {
    const {data,error} = await client().GET('/finance/ap_invoice_items/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving APInvoiceItem', { cause: error });
    }
    return data.data;
}