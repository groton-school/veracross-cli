import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type NumericGradePatch = RequestData<operations, 'update_academics_numeric_grades'>;

export const UPDATE_SCOPE = 'academics.numeric_grades:update';

/** Update Academics: Numeric Grades */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_numeric_grades'>): Promise<void> {
    const { error } = await client().PATCH('/academics/numeric_grades/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating NumericGrade', { cause: error });
    }
}