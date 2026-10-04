import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'finance.ap_disbursements:create';

/** Create Finance: AP Disbursements */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_finance_ap_disbursements'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/finance/ap_disbursements', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ApDisbursement', { cause: error });
    }
    return id;
}