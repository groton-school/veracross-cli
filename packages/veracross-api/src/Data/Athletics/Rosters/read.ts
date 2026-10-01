import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'athletics.rosters:read';

export type Roster = ResponseData<'read_athletics_rosters'>;

/** Read Athletics: Rosters */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_athletics_rosters'>): Promise<Roster> {
    const {data,error} = await client().GET('/athletics/rosters/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Roster', { cause: error });
    }
    return data.data;
}