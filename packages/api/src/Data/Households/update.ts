import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type UpdateHouseholdPatch = RequestData<operations, 'update_households'>;

export const UPDATE_SCOPE = 'households:update';

/** Update Households */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_households'>): Promise<void> {
    const { error } = await client().PATCH('/households/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateHousehold', { cause: error });
    }
}