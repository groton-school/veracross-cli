import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'athletics.sports:create';

/** Create Athletics: Sports */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_athletics_sports'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/athletics/sports', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Sport', { cause: error });
    }
    return id;
}