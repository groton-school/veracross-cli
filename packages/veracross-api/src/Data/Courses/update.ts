import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type UpdateCoursePatch = RequestData<operations, 'update_courses'>;

export const UPDATE_SCOPE = 'courses:update';

/** Update Courses */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_courses'>): Promise<void> {
    const { error } = await client().PATCH('/courses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateCourse', { cause: error });
    }
}