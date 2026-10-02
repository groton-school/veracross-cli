import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'non-academics.courses:create';

/** Create Non-Academics: Courses */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_non_academics_courses'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/non-academics/courses', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Course', { cause: error });
    }
    return id;
}