import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'finance.vendors:read';

export type Vendor = ResponseData<'read_finance_vendors'>;

/** Read Finance: Vendors */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_finance_vendors'>): Promise<Vendor> {
    const {data,error} = await client().GET('/finance/vendors/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Vendor', { cause: error });
    }
    return data.data;
}