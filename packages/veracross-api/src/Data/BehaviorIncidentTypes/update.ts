import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'behavior_incident_types:update';

/** Update Behavior Incident Types */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_behavior_incident_types'>): Promise<void> {
    const { error } = await client().PATCH('/behavior_incident_types/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateBehaviorIncidentType', { cause: error });
    }
}