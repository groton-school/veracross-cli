import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'summer.enrollments:create';

/** Create Summer: Enrollments */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_summer_enrollments'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/summer/enrollments', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Enrollment', { cause: error });
    }
    return id;
}