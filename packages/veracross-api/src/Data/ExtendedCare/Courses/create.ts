import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'extended_care.courses:create';

/** Create Extended Care: Courses */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_extended_care_courses'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/extended_care/courses', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Course', { cause: error });
    }
    return id;
}