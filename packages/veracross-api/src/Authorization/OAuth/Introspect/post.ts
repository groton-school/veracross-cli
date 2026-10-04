import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js';


/** Token Introspection */
export async function post({ 
    body,
    ...params
}: EndpointOptions<operations, 'post-oauth-introspect'>): Promise<ResponseBody<operations, 'post-oauth-introspect'>|undefined> {
    const { header, ...rest} = params;
    const { data,  error } = await client().POST('/oauth/introspect', {
        params: {
            header: {
                ...header,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            ...rest },
        body
    });
    if (error) {
        throw new Error('Error creating TokenIntrospection', { cause: error });
    }
    return data;
}