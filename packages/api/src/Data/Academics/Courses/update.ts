import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type CoursePatch = RequestData<operations, 'update_academics_courses'>;

export const UPDATE_SCOPE = 'academics.courses:update';

/** Update Academics: Courses */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_academics_courses'>): Promise<void> {
    const { error } = await client().PATCH('/academics/courses/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Course', { cause: error });
    }
}