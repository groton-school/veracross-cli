import { operations } from '#spec/Data-API.js';
import { client, defaults } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'academics.class_attendance_statuses:list';

export type ClassAttendanceStatuCollection = ResponseData<operations, 'list_academics_class_attendance_status'>;

/** List Academics: Class Attendance Status */
export async function list({ 
    header,
    ...rest
}: EndpointOptions<operations, 'list_academics_class_attendance_status'>): Promise<ClassAttendanceStatuCollection> {
    const collection: ClassAttendanceStatuCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/academics/class_attendance_statuses', {
            params: {
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
                `Error list of ClassAttendanceStatu at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}