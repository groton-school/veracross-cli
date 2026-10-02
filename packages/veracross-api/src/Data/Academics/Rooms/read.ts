import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.rooms:read';

export type Room = ResponseData<'read_academics_rooms'>;

/** Read Academics: Rooms */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_academics_rooms'>): Promise<Room> {
    const {data,error} = await client().GET('/academics/rooms/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Room', { cause: error });
    }
    return data.data;
}