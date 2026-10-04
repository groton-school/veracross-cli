import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js';

export const CREATE_SCOPE = '';

/** Create Access Token */
export async function post({ 
    body,
    ...rest
}: EndpointOptions<operations, 'create-access-token'>): Promise<ResponseBody<operations, 'create-access-token'>|undefined> {
    const { data,  error } = await client().POST('/oauth/token', {
        params: { ...rest },
        body
    });
    if (error) {
        throw new Error('Error creating CreateAccessToken', { cause: error });
    }
    return data;
}