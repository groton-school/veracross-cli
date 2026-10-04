import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'transportation.schedules:read';

export type Schedule = ResponseData<operations, 'read_transportation_schedules'>;

/** Read Transportation: Schedules */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_transportation_schedules'>): Promise<Schedule> {
    const {data,error} = await client().GET('/transportation/schedules/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Schedule', { cause: error });
    }
    return data.data;
}