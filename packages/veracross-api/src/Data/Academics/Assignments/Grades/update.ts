import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.assignments.grades:update';

/** Update Academics: Assignment Grades */
export async function update({ 
    assignment_id, 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_assignment_grades'>): Promise<void> {
    const { error } = await client().PATCH('/academics/assignments/{assignment_id}/grades/{id}', {
        params: { path: { assignment_id, id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating AssignmentGrade', { cause: error });
    }
}