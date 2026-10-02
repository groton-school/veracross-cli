import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'finance.ap_invoices:update';

/** Update Finance: AP Invoices */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_finance_ap_invoices'>): Promise<void> {
    const { error } = await client().PATCH('/finance/ap_invoices/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ApInvoice', { cause: error });
    }
}