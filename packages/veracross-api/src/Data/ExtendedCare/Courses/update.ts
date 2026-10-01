import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'extended_care.courses:update';

/** Update Extended Care: Courses */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_extended_care_courses'>): Promise<void> {
    const { error } = await client().PATCH('/extended_care/courses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Course', { cause: error });
    }
}