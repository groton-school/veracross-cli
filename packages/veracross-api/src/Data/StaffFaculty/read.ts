import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'staff_faculty:read';

export type ReadStaffFaculty = ResponseData<'read_staff_faculty'>;

/** Read Staff/Faculty */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_staff_faculty'>): Promise<ReadStaffFaculty> {
    const {data,error} = await client().GET('/staff_faculty/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadStaffFaculty', { cause: error });
    }
    return data.data;
}