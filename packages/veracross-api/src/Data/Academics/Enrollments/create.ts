import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.enrollments:create';

/** Create Academics: Enrollments */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_academics_enrollments'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/enrollments', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Enrollment', { cause: error });
    }
    return id;
}