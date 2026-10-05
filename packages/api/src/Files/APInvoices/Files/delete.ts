import { operations } from '#spec/Files-API.js';
import { client } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const DELETE_SCOPE = 'files:ap_invoices.files:delete';

/** Delete Finance: AP Invoice Files */
export async function delete_({ 
    invoice_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'delete_finance_ap_invoice_files'>): Promise<void> {
    const { error } = await client().DELETE('/ap_invoices/{invoice_id}/files/{id}', {
        params: { path: { invoice_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error deleting APInvoiceFile', { cause: error });
    }
}