import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type AssignmentGradePatch = RequestData<operations, 'update_academics_assignment_grades'>;

export const UPDATE_SCOPE = 'academics.assignments.grades:update';

/** Update Academics: Assignment Grades */
export async function update({ 
    assignment_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_assignment_grades'>): Promise<void> {
    const { error } = await client().PATCH('/academics/assignments/{assignment_id}/grades/{id}', {
        params: { path: { assignment_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating AssignmentGrade', { cause: error });
    }
}