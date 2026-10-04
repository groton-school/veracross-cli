import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'finance.ap_invoice_items:update';

/** Update Finance: AP Invoice Items */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_finance_ap_invoice_items'>): Promise<void> {
    const { error } = await client().PATCH('/finance/ap_invoice_items/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating APInvoiceItem', { cause: error });
    }
}