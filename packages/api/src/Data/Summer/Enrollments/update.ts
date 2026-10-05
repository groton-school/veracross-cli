import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { RequestData } from '#types/RequestBody.js';

export type EnrollmentPatch = RequestData<operations, 'update_summer_enrollments'>;

export const UPDATE_SCOPE = 'summer.enrollments:update';

/** Update Summer: Enrollments */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_summer_enrollments'>): Promise<void> {
    const { error } = await client().PATCH('/summer/enrollments/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating Enrollment', { cause: error });
    }
}