import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'finance.ap_invoices.ap_invoice_items:create';

/** Create Finance: AP Invoice Items */
export async function create({ 
    invoice_id,
    data,
    ...rest
}: EndpointOptions<operations, 'create_finance_ap_invoice_items'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/finance/ap_invoices/{invoice_id}/ap_invoice_items', {
        params: { path: { invoice_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ApInvoiceItem', { cause: error });
    }
    return id;
}