import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'athletics.teams:read';

export type Team = ResponseData<operations, 'read_athletics_teams'>;

/** Read Athletics: Teams */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_athletics_teams'>): Promise<Team> {
    const {data,error} = await client().GET('/athletics/teams/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Team', { cause: error });
    }
    return data.data;
}