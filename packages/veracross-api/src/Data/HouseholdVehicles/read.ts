import { client } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js'

export const READ_SCOPE = 'household_vehicles:read';

export type ReadHouseholdVehicle = ResponseData<'read_household_vehicles'>;

/** Read Household Vehicles */
export async function read({ 
    id, 
    ...rest
}: EndpointOptions<'read_household_vehicles'>): Promise<ReadHouseholdVehicle> {
    const {data,error} = await client().GET('/household_vehicles/{id}', {
        params: { path: { id,  }, ...rest }
    });
    if (error) {
        throw new Error('Error retrieving ReadHouseholdVehicle', { cause: error });
    }
    return data.data;
}