import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'staff_faculty:create';

/** Create Staff/Faculty */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_staff_faculty'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/staff_faculty', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateStaffFaculty', { cause: error });
    }
    return id;
}