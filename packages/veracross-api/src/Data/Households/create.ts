import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'households:create';

/** Create Households */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_households'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/households', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateHousehold', { cause: error });
    }
    return id;
}