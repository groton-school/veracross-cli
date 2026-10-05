import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.projects:read';

export type Project = ResponseData<operations, 'read_finance_projects'>;

/** Read Finance: Projects */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_finance_projects'>): Promise<Project> {
    const {data,error} = await client().GET('/finance/projects/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Project', { cause: error });
    }
    return data.data;
}