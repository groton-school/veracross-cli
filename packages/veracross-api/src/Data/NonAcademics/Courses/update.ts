import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'non-academics.courses:update';

/** Update Non-Academics: Courses */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_non_academics_courses'>): Promise<void> {
    const { error } = await client().PATCH('/non-academics/courses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Course', { cause: error });
    }
}