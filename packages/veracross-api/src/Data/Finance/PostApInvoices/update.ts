import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'finance.post_ap_invoices:update';

/** Update Finance: Post AP Invoices */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_finance_post_ap_invoices'>): Promise<void> {
    const { error } = await client().PATCH('/finance/post_ap_invoices/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating PostApInvoice', { cause: error });
    }
}