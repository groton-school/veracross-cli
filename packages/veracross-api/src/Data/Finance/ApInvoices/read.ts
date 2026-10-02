import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.ap_invoices:read';

export type ApInvoice = ResponseData<'read_finance_ap_invoices'>;

/** Read Finance: AP Invoices */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_finance_ap_invoices'>): Promise<ApInvoice> {
    const {data,error} = await client().GET('/finance/ap_invoices/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ApInvoice', { cause: error });
    }
    return data.data;
}