import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'finance.ap_disbursement_items:update';

/** Update Finance: AP Disbursement Items */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_finance_ap_disbursement_items'>): Promise<void> {
    const { error } = await client().PATCH('/finance/ap_disbursement_items/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ApDisbursementItem', { cause: error });
    }
}