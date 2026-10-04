import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'extended_care.classes:create';

/** Create Extended Care: Classes */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_extended_care_classes'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/extended_care/classes', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Classe', { cause: error });
    }
    return id;
}