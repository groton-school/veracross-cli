import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'programs.classes:create';

/** Create Programs: Classes */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_programs_classes'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/programs/classes', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Classe', { cause: error });
    }
    return id;
}