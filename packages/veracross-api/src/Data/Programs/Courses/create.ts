import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'programs.courses:create';

/** Create Programs: Courses */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_programs_courses'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/programs/courses', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Course', { cause: error });
    }
    return id;
}