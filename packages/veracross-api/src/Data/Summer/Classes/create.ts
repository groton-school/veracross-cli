import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'summer.classes:create';

/** Create Summer: Classes */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_summer_classes'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/summer/classes', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Classe', { cause: error });
    }
    return id;
}