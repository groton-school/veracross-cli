import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'finance.ap_invoices:create';

/** Create Finance: AP Invoices */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_finance_ap_invoices'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/finance/ap_invoices', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ApInvoice', { cause: error });
    }
    return id;
}