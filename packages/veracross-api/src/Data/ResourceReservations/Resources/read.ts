import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'resource_reservations.resources:read';

export type Resource = ResponseData<operations, 'read_resource_reservations_resources'>;

/** Read Resource Reservations: Resources */
export async function read({ 
    resource_id, 
    ...rest
}: EndpointOptions<operations, 'read_resource_reservations_resources'>): Promise<Resource> {
    const {data,error} = await client().GET('/resource_reservations/resources/{resource_id}', {
        params: { path: { resource_id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Resource', { cause: error });
    }
    return data.data;
}