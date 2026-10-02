import { client } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'finance.projects:read';

export type Project = ResponseData<'read_finance_projects'>;

/** Read Finance: Projects */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_finance_projects'>): Promise<Project> {
    const {data,error} = await client().GET('/finance/projects/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving Project', { cause: error });
    }
    return data.data;
}