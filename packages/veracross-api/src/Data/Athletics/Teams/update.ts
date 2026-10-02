import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'athletics.teams:update';

/** Update Athletics: Teams */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_athletics_teams'>): Promise<void> {
    const { error } = await client().PATCH('/athletics/teams/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Team', { cause: error });
    }
}