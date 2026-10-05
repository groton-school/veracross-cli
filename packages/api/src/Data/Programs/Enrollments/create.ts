import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'programs.enrollments:create';

/** Create Programs: Enrollments */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_programs_enrollments'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/programs/enrollments', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Enrollment', { cause: error });
    }
    return id;
}