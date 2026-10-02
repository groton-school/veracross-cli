import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.tax_types:read';

export type TaxType = ResponseData<'read_finance_tax_types'>;

/** Read Finance: Tax Types */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_finance_tax_types'>): Promise<TaxType> {
    const {data,error} = await client().GET('/finance/tax_types/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving TaxType', { cause: error });
    }
    return data.data;
}