import { operations } from '#spec/Data-API.js';
import { client } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js'

export const READ_SCOPE = 'academics.config.grading_periods:read';

export type GradingPeriod = ResponseData<operations, 'read_academics_grading_periods'>;

/** Read Academics: Grading Periods */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<operations, 'read_academics_grading_periods'>): Promise<GradingPeriod> {
    const {data,error} = await client().GET('/academics/config/grading_periods/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving GradingPeriod', { cause: error });
    }
    return data.data;
}