import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'non-academics.classes:create';

/** Create Non-Academics: Classes */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_non_academics_classes'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/non-academics/classes', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Classe', { cause: error });
    }
    return id;
}