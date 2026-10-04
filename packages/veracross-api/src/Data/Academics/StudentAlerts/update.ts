import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.student_alerts:update';

/** Update Academics: Student Alerts */
export async function update({ 
    person_id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_student_alerts'>): Promise<void> {
    const { error } = await client().PATCH('/academics/student_alerts/{person_id}', {
        params: { path: { person_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating StudentAlert', { cause: error });
    }
}