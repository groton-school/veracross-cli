import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'finance.vendors:create';

/** Create Finance: Vendors */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_finance_vendors'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/finance/vendors', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Vendor', { cause: error });
    }
    return id;
}