import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.ap_invoices:read';

export type APInvoice = ResponseData<operations, 'read_finance_ap_invoices'>;

/** Read Finance: AP Invoices */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_finance_ap_invoices'>): Promise<APInvoice> {
    const {data,error} = await client().GET('/finance/ap_invoices/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving APInvoice', { cause: error });
    }
    return data.data;
}