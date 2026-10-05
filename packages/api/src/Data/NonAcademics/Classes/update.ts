import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type ClassPatch = RequestData<operations, 'update_non_academics_classes'>;

export const UPDATE_SCOPE = 'non-academics.classes:update';

/** Update Non-Academics: Classes */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_non_academics_classes'>): Promise<void> {
    const { error } = await client().PATCH('/non-academics/classes/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Class', { cause: error });
    }
}