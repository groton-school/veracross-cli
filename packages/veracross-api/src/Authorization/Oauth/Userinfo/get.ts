import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js'

export const READ_SCOPE = '';

export type UserInfo = ResponseBody<operations, 'get-oauth-userinfo'>;

/** User Info */
export async function get({ 
    ...rest
}: EndpointOptions<operations, 'get-oauth-userinfo', 'GET'>): Promise<UserInfo|undefined> {
    const {data,error} = await client().GET('/oauth/userinfo', {
        params: { ...rest }
    });
    if (error) {
        throw new Error('Error retrieving UserInfo', { cause: error });
    }
    return data;
}