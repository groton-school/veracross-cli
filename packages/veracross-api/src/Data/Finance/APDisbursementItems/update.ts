import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type APDisbursementItemPatch = RequestData<operations, 'update_finance_ap_disbursement_items'>;

export const UPDATE_SCOPE = 'finance.ap_disbursement_items:update';

/** Update Finance: AP Disbursement Items */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_finance_ap_disbursement_items'>): Promise<void> {
    const { error } = await client().PATCH('/finance/ap_disbursement_items/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating APDisbursementItem', { cause: error });
    }
}