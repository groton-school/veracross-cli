import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'boarding.dorms.students:read';

export type DormStudent = ResponseData<'read_boarding_dorm_students'>;

/** Read Boarding: Dorm Students */
export async function read({ 
    internal_dorm_id, 
    id, 
    ...rest
}: EndpointOptions<'read_boarding_dorm_students'>): Promise<DormStudent> {
    const {data,error} = await client().GET('/boarding/dorms/{internal_dorm_id}/students/{id}', {
        params: { path: { internal_dorm_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving DormStudent', { cause: error });
    }
    return data.data;
}