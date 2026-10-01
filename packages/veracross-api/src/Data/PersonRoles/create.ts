import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'person_roles:create';

/** Create Person Roles */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_person_roles'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/person_roles', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreatePersonRole', { cause: error });
    }
    return id;
}