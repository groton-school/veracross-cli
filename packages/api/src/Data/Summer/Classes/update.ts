import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ClassPatch = RequestData<operations, 'update_summer_classes'>;

export const UPDATE_SCOPE = 'summer.classes:update';

/** Update Summer: Classes */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_summer_classes'>): Promise<void> {
    const { error } = await client().PATCH('/summer/classes/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Class', { cause: error });
    }
}