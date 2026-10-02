import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'events.group_events:create';

/** Create Events */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_events'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/events/group_events', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating CreateEvent', { cause: error });
    }
    return id;
}