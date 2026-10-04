import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.ap_disbursement_items:read';

export type APDisbursementItem = ResponseData<operations, 'read_finance_ap_disbursement_items'>;

/** Read Finance: AP Disbursement Items */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_finance_ap_disbursement_items'>): Promise<APDisbursementItem> {
    const {data,error} = await client().GET('/finance/ap_disbursement_items/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving APDisbursementItem', { cause: error });
    }
    return data.data;
}