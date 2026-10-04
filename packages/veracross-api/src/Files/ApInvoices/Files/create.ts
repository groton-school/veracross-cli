import { operations } from '#spec/Files-API.js';
import { client } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'files:ap_invoices.files:create';

/** Create Finance: AP Invoice Files */
export async function create({ 
    invoice_id,
    data,
    ...rest
}: EndpointOptions<operations, 'create_finance_ap_invoice_files'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/ap_invoices/{invoice_id}/files', {
        params: { path: { invoice_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ApInvoiceFile', { cause: error });
    }
    return id;
}