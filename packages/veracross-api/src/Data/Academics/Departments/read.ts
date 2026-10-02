import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.departments:read';

export type Department = ResponseData<'read_academics_departments'>;

/** Read Academics: Departments */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_departments'>): Promise<Department> {
    const {data,error} = await client().GET('/academics/departments/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Department', { cause: error });
    }
    return data.data;
}