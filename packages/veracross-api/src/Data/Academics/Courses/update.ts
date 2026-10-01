import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.courses:update';

/** Update Academics: Courses */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_courses'>): Promise<void> {
    const { error } = await client().PATCH('/academics/courses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Course', { cause: error });
    }
}