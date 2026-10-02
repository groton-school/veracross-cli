import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const CREATE_SCOPE = 'events.athletics:create';

/** Create Events: Athletics */
export async function create({ 
    data,
    ...rest
}: EndpointOptions<'create_events_athletics'>): Promise<number|undefined> {
    const { data: {data: { id } = {}} = {},  error } = await client().POST('/events/athletics', {
        params: { ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error creating Athletic', { cause: error });
    }
    return id;
}