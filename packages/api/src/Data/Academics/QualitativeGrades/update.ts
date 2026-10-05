import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type QualitativeGradePatch = RequestData<operations, 'update_academics_qualitative_grades'>;

export const UPDATE_SCOPE = 'academics.qualitative_grades:update';

/** Update Academics: Qualitative Grades */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_qualitative_grades'>): Promise<void> {
    const { error } = await client().PATCH('/academics/qualitative_grades/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating QualitativeGrade', { cause: error });
    }
}