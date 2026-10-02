import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.permissions:read';

export type ClassesPermission = ResponseData<'read_academics_classes_permissions'>;

/** Read Academics: Classes - Permissions */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_classes_permissions'>): Promise<ClassesPermission> {
    const {data,error} = await client().GET('/academics/permissions/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ClassesPermission', { cause: error });
    }
    return data.data;
}