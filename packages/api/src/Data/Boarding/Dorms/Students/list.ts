import { operations } from '#spec/Data-API.js';
import { client, defaults } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'boarding.dorms.students:list';

export type DormStudentCollection = ResponseData<operations, 'list_boarding_dorm_students'>;

/** List Boarding: Dorm Students */
export async function list({ 
    internal_dorm_id, 
    header,
    ...rest
}: EndpointOptions<operations, 'list_boarding_dorm_students'>): Promise<DormStudentCollection> {
    const collection: DormStudentCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/boarding/dorms/{internal_dorm_id}/students', {
            params: {
                path : { internal_dorm_id,  },
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
                `Error list of DormStudent at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}