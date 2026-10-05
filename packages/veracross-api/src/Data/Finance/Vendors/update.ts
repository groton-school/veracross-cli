import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type VendorPatch = RequestData<operations, 'update_finance_vendors'>;

export const UPDATE_SCOPE = 'finance.vendors:update';

/** Update Finance: Vendors */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_finance_vendors'>): Promise<void> {
    const { error } = await client().PATCH('/finance/vendors/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Vendor', { cause: error });
    }
}