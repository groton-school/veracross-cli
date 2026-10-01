import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'boarding.dorms.attendance:list';

export type DormAttendanceCollection = ResponseData<'list_boarding_dorm_attendance'>;

/** List Boarding: Dorm Attendance */
export async function list({ 
    internal_dorm_id, 
    header,
    ...rest
}: EndpointOptions<'list_boarding_dorm_attendance'>): Promise<DormAttendanceCollection> {
    const collection: DormAttendanceCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/boarding/dorms/{internal_dorm_id}/attendance', {
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
                `Error list of DormAttendance at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}