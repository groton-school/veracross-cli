import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'athletics.teams:create';

/** Create Athletics: Teams */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_athletics_teams'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/athletics/teams', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Team', { cause: error });
    }
    return id;
}