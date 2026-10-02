import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'convert_parent_to_staff:create';

/** Create Convert Parent Account to Staff Account */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_convert_parent_account_to_staff_account'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/convert_parent_to_staff', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateConvertParentAccountToStaffAccount', { cause: error });
    }
    return id;
}