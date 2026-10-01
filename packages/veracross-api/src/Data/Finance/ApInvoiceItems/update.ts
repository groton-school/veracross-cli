import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'finance.ap_invoice_items:update';

/** Update Finance: AP Invoice Items */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_finance_ap_invoice_items'>): Promise<void> {
    const { error } = await client().PATCH('/finance/ap_invoice_items/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ApInvoiceItem', { cause: error });
    }
}