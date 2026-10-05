import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type SportPatch = RequestData<operations, 'update_athletics_sports'>;

export const UPDATE_SCOPE = 'athletics.sports:update';

/** Update Athletics: Sports */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_athletics_sports'>): Promise<void> {
    const { error } = await client().PATCH('/athletics/sports/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Sport', { cause: error });
    }
}