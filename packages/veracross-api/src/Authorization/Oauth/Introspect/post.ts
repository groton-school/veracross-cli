import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js';

export const CREATE_SCOPE = '';

/** Token Introspection */
export async function post({ 
    body,
    ...rest
}: EndpointOptions<operations, 'post-oauth-introspect'>): Promise<ResponseBody<operations, 'post-oauth-introspect'>|undefined> {
    const { data,  error } = await client().POST('/oauth/introspect', {
        params: { ...rest },
        body
    });
    if (error) {
        throw new Error('Error creating TokenIntrospection', { cause: error });
    }
    return data;
}