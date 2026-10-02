import { client, defaults } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'calendars.student_calendars:list';

export type StudentCalendarCollection = ResponseData<'list_calendars_student_calendars'>;

/** List Calendars: Student Calendars */
export async function list({ 
    person_id, 
    header,
    ...rest
}: EndpointOptions<'list_calendars_student_calendars'>): Promise<StudentCalendarCollection> {
    const collection: StudentCalendarCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/calendars/student_calendars/{person_id}', {
            params: {
                path : { person_id,  },
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
                `Error list of StudentCalendar at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}