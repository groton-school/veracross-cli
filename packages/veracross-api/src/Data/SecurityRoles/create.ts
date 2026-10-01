import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'security_roles:create';

/** Create Security Roles */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_security_roles'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/security_roles', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateSecurityRole', { cause: error });
    }
    return id;
}