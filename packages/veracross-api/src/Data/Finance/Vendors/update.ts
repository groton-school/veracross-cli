import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'finance.vendors:update';

/** Update Finance: Vendors */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_finance_vendors'>): Promise<void> {
    const { error } = await client().PATCH('/finance/vendors/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Vendor', { cause: error });
    }
}