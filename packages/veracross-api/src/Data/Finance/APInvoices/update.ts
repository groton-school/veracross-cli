import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type APInvoicePatch = RequestData<operations, 'update_finance_ap_invoices'>;

export const UPDATE_SCOPE = 'finance.ap_invoices:update';

/** Update Finance: AP Invoices */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_finance_ap_invoices'>): Promise<void> {
    const { error } = await client().PATCH('/finance/ap_invoices/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating APInvoice', { cause: error });
    }
}