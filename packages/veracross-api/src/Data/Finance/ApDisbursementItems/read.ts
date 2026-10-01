import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'finance.ap_disbursement_items:read';

export type ApDisbursementItem = ResponseData<'read_finance_ap_disbursement_items'>;

/** Read Finance: AP Disbursement Items */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_finance_ap_disbursement_items'>): Promise<ApDisbursementItem> {
    const {data,error} = await client().GET('/finance/ap_disbursement_items/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ApDisbursementItem', { cause: error });
    }
    return data.data;
}