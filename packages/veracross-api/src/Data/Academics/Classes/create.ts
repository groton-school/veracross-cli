import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.classes:create';

/** Create Academics: Classes */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_academics_classes'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/classes', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Classe', { cause: error });
    }
    return id;
}