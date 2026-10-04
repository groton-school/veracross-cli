import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js';


/** Revoke Token */
export async function post({ 
    body,
    ...params
}: EndpointOptions<operations, 'post-oauth-revoke'>): Promise<ResponseBody<operations, 'post-oauth-revoke'>|undefined> {
    const { header, ...rest} = params;
    const { data,  error } = await client().POST('/oauth/revoke', {
        params: {
            header: {
                ...header,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            ...rest },
        body
    });
    if (error) {
        throw new Error('Error creating RevokeToken', { cause: error });
    }
    return data;
}