import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.ap_disbursements:read';

export type ApDisbursement = ResponseData<operations, 'read_finance_ap_disbursements'>;

/** Read Finance: AP Disbursements */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_finance_ap_disbursements'>): Promise<ApDisbursement> {
    const {data,error} = await client().GET('/finance/ap_disbursements/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ApDisbursement', { cause: error });
    }
    return data.data;
}