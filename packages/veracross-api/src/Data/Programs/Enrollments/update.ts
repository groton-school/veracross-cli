import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'programs.enrollments:update';

/** Update Programs: Enrollments */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_programs_enrollments'>): Promise<void> {
    const { error } = await client().PATCH('/programs/enrollments/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Enrollment', { cause: error });
    }
}