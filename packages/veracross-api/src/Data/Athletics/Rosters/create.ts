import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'athletics.rosters:create';

/** Create Athletics: Rosters */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_athletics_rosters'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/athletics/rosters', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Roster', { cause: error });
    }
    return id;
}