import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'finance.ap_disbursements:update';

/** Update Finance: AP Disbursements */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_finance_ap_disbursements'>): Promise<void> {
    const { error } = await client().PATCH('/finance/ap_disbursements/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating ApDisbursement', { cause: error });
    }
}