import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js'


export type JsonWebKeySetJwk = ResponseBody<operations, 'jwks'>;

/** JSON Web Key Set (JWKS) */
export async function get({ 
    ...rest
}: EndpointOptions<operations, 'jwks', 'GET'>): Promise<JsonWebKeySetJwk|undefined> {
    const {data,error} = await client().GET('/oauth/discovery/keys', {
        params: { ...rest }
    });
    if (error) {
        throw new Error('Error retrieving JsonWebKeySetJwk', { cause: error });
    }
    return data;
}