import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'courses:update';

/** Update Courses */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_courses'>): Promise<void> {
    const { error } = await client().PATCH('/courses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateCourse', { cause: error });
    }
}