import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'admission.relatives.relationships:read';

export type RelativeRelationship = ResponseData<operations, 'read_admission_relative_relationships'>;

/** Read Admission: Relative Relationships */
export async function read({ 
    relative_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_admission_relative_relationships'>): Promise<RelativeRelationship> {
    const {data,error} = await client().GET('/admission/relatives/{relative_id}/relationships/{id}', {
        params: { path: { relative_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RelativeRelationship', { cause: error });
    }
    return data.data;
}