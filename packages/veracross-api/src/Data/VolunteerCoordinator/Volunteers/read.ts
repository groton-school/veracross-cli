import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'volunteer_coordinator.volunteers:read';

export type Volunteer = ResponseData<'read_volunteer_coordinator_volunteers'>;

/** Read Volunteer Coordinator: Volunteers */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_volunteer_coordinator_volunteers'>): Promise<Volunteer> {
    const {data,error} = await client().GET('/volunteer_coordinator/volunteers/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Volunteer', { cause: error });
    }
    return data.data;
}