import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'admission.relatives.relationships:create';

/** Create Admission: Relative Relationships */
export async function create({ 
    relative_id,
    data,
    ...rest
}: EndpointOptions<'create_admission_relative_relationships'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/admission/relatives/{relative_id}/relationships', {
        params: { path: { relative_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating RelativeRelationship', { cause: error });
    }
    return id;
}