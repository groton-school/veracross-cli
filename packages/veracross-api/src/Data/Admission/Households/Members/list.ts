import { operations } from '#spec/Data-API.js';
import { client, defaults } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'admission.households.members:list';

export type HouseholdMemberCollection = ResponseData<operations, 'list_admission_household_members'>;

/** List Admission: Household Members */
export async function list({ 
    household_id, 
    header,
    ...rest
}: EndpointOptions<operations, 'list_admission_household_members'>): Promise<HouseholdMemberCollection> {
    const collection: HouseholdMemberCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/admission/households/{household_id}/members', {
            params: {
                path : { household_id,  },
                header: {
                    ...header,
                    'X-Page-Number': page,
                    'X-Page-Size': page_size
                },
                ...rest
            }
        });
        if (error) {
            throw new Error(
                `Error list of HouseholdMember at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}