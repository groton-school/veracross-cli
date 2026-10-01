import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const UPDATE_SCOPE = 'academics.enrollments:update';

/** Update Academics: Enrollments */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<'update_academics_enrollments'>): Promise<void> {
    const { error } = await client().PATCH('/academics/enrollments/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Enrollment', { cause: error });
    }
}