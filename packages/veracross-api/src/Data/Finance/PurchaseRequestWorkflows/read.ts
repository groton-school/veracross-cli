import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.purchase_request_workflows:read';

export type PurchaseRequestWorkflow = ResponseData<'read_finance_purchase_request_workflow'>;

/** Read Finance: Purchase Request Workflow */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_finance_purchase_request_workflow'>): Promise<PurchaseRequestWorkflow> {
    const {data,error} = await client().GET('/finance/purchase_request_workflows/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving PurchaseRequestWorkflow', { cause: error });
    }
    return data.data;
}