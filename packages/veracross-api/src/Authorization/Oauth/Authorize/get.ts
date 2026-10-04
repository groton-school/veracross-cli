import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js'

export const READ_SCOPE = '';

export type Authorize = ResponseBody<operations, 'get-oauth-authorize'>;

/** Authorize */
export async function get({ 
    ...rest
}: EndpointOptions<operations, 'get-oauth-authorize', 'GET'>): Promise<Authorize|undefined> {
    const {data,error} = await client().GET('/oauth/authorize', {
        params: { ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Authorize', { cause: error });
    }
    return data;
}