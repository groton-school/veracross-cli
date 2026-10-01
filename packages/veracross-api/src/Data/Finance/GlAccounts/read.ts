import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'finance.gl_accounts:read';

export type GlAccount = ResponseData<'read_finance_gl_accounts'>;

/** Read Finance: GL Accounts */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_finance_gl_accounts'>): Promise<GlAccount> {
    const {data,error} = await client().GET('/finance/gl_accounts/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving GlAccount', { cause: error });
    }
    return data.data;
}