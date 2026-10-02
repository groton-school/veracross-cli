import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.qualitative_grades:update';

/** Update Academics: Qualitative Grades */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_qualitative_grades'>): Promise<void> {
    const { error } = await client().PATCH('/academics/qualitative_grades/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating QualitativeGrade', { cause: error });
    }
}