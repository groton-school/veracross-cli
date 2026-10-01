import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'finance.ap_disbursements.ap_disbursement_items:create';

/** Create Finance: AP Disbursement Items */
export async function create({ 
    disbursement_id,
    data,
    ...rest
}: EndpointOptions<'create_finance_ap_disbursement_items'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/finance/ap_disbursements/{disbursement_id}/ap_disbursement_items', {
        params: { path: { disbursement_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ApDisbursementItem', { cause: error });
    }
    return id;
}