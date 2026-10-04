import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js'


export type OpenIdProviderConfiguration = ResponseBody<operations, 'openid-configuration'>;

/** OpenID Provider Configuration */
export async function get({ 
    ...rest
}: EndpointOptions<operations, 'openid-configuration', 'GET'>): Promise<OpenIdProviderConfiguration|undefined> {
    const {data,error} = await client().GET('/.well-known/openid-configuration', {
        params: { ...rest }
    });
    if (error) {
        throw new Error('Error retrieving OpenIdProviderConfiguration', { cause: error });
    }
    return data;
}