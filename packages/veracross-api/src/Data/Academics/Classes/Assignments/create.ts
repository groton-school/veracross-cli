import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';

export const CREATE_SCOPE = 'academics.classes.assignments:create';

/** Create Academics: Class Assignments */
export async function create({ 
    internal_class_id,
    data,
    ...rest
}: EndpointOptions<'create_academics_class_assignments'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/academics/classes/{internal_class_id}/assignments', {
        params: { path: { internal_class_id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating ClassAssignment', { cause: error });
    }
    return id;
}