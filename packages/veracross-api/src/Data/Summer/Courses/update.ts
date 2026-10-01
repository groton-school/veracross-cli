import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'summer.courses:update';

/** Update Summer: Courses */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_summer_courses'>): Promise<void> {
    const { error } = await client().PATCH('/summer/courses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Course', { cause: error });
    }
}