import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js';

export const CREATE_SCOPE = '';

/** Revoke Token */
export async function post({ 
    body,
    ...rest
}: EndpointOptions<operations, 'post-oauth-revoke'>): Promise<ResponseBody<operations, 'post-oauth-revoke'>|undefined> {
    const { data,  error } = await client().POST('/oauth/revoke', {
        params: { ...rest },
        body
    });
    if (error) {
        throw new Error('Error creating RevokeToken', { cause: error });
    }
    return data;
}