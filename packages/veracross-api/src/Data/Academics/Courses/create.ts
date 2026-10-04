import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.courses:create';

/** Create Academics: Courses */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_academics_courses'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/courses', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Course', { cause: error });
    }
    return id;
}