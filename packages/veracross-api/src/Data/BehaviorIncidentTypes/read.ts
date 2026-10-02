import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'behavior_incident_types:read';

export type ReadBehaviorIncidentType = ResponseData<'read_behavior_incident_types'>;

/** Read Behavior Incident Types */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_behavior_incident_types'>): Promise<ReadBehaviorIncidentType> {
    const {data,error} = await client().GET('/behavior_incident_types/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadBehaviorIncidentType', { cause: error });
    }
    return data.data;
}