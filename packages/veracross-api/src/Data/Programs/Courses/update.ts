import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'programs.courses:update';

/** Update Programs: Courses */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_programs_courses'>): Promise<void> {
    const { error } = await client().PATCH('/programs/courses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Course', { cause: error });
    }
}