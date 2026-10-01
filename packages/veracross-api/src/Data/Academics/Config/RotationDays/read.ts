import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'academics.config.rotation_days:read';

export type RotationDay = ResponseData<'read_academics_rotation_days'>;

/** Read Academics: Rotation Days */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_rotation_days'>): Promise<RotationDay> {
    const {data,error} = await client().GET('/academics/config/rotation_days/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving RotationDay', { cause: error });
    }
    return data.data;
}