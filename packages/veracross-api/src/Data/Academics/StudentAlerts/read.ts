import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.student_alerts:read';

export type StudentAlert = ResponseData<operations, 'read_academics_student_alerts'>;

/** Read Academics: Student Alerts */
export async function read({ 
    person_id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_student_alerts'>): Promise<StudentAlert> {
    const {data,error} = await client().GET('/academics/student_alerts/{person_id}', {
        params: { path: { person_id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving StudentAlert', { cause: error });
    }
    return data.data;
}