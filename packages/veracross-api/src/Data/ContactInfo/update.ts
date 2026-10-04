import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';

export const UPDATE_SCOPE = 'contact_info:update';

/** Update Contact Info */
export async function update({ 
    id, 
    data,
    ...rest
}: EndpointOptions<operations, 'update_contact_info'>): Promise<void> {
    const { error } = await client().PATCH('/contact_info/{id}', {
        params: { path: { id,  }, ...rest },
        body: { data }
    });
    if (error) {
        throw new Error('Error updating UpdateContactInfo', { cause: error });
    }
}