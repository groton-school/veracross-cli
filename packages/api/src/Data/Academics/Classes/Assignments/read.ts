import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.classes.assignments:read';

export type ClassAssignment = ResponseData<operations, 'read_academics_class_assignments'>;

/** Read Academics: Class Assignments */
export async function read({ 
    internal_class_id, 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_class_assignments'>): Promise<ClassAssignment> {
    const {data,error} = await client().GET('/academics/classes/{internal_class_id}/assignments/{id}', {
        params: { path: { internal_class_id, id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassAssignment', { cause: error });
    }
    return data.data;
}