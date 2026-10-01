import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'person_enrollment_history:read';

export type ReadPersonEnrollmentHistory = ResponseData<'read_person_enrollment_history'>;

/** Read Person Enrollment History */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_person_enrollment_history'>): Promise<ReadPersonEnrollmentHistory> {
    const {data,error} = await client().GET('/person_enrollment_history/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadPersonEnrollmentHistory', { cause: error });
    }
    return data.data;
}