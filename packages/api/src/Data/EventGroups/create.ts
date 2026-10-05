import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'event_groups:create';

/** Create Event Groups */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<operations, 'create_event_groups'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/event_groups', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateEventGroup', { cause: error });
    }
    return id;
}