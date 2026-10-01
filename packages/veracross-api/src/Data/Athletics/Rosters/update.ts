import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'athletics.rosters:update';

/** Update Athletics: Rosters */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_athletics_rosters'>): Promise<void> {
    const { error } = await client().PATCH('/athletics/rosters/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Roster', { cause: error });
    }
}