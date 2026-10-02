import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'behavior:create';

/** Create Behavior */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_behavior'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/behavior', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateBehavior', { cause: error });
    }
    return id;
}