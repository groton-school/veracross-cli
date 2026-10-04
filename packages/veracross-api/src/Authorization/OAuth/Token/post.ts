import { operations } from '#spec/Authorization-API.js';
import { client } from '#Authorization/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseBody } from '#types/ResponseBody.js';


/** Create Access Token */
export async function post({ 
    body,
    ...params
}: EndpointOptions<operations, 'create-access-token'>): Promise<ResponseBody<operations, 'create-access-token'>|undefined> {
    const { header, ...rest} = params;
    const { data,  error } = await client().POST('/oauth/token', {
        params: {
            header: {
                ...header,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            ...rest },
        body
    });
    if (error) {
        throw new Error('Error creating CreateAccessToken', { cause: error });
    }
    return data;
}