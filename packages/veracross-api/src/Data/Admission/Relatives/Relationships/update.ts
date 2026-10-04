import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'admission.relatives.relationships:update';

/** Update Admission: Relative Relationships */
export async function update({ 
    relative_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_admission_relative_relationships'>): Promise<void> {
    const { error } = await client().PATCH('/admission/relatives/{relative_id}/relationships/{id}', {
        params: { path: { relative_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating RelativeRelationship', { cause: error });
    }
}