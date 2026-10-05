import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type TeamPatch = RequestData<operations, 'update_athletics_teams'>;

export const UPDATE_SCOPE = 'athletics.teams:update';

/** Update Athletics: Teams */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_athletics_teams'>): Promise<void> {
    const { error } = await client().PATCH('/athletics/teams/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Team', { cause: error });
    }
}