import { client, defaults } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'calendars.parent_calendars:list';

export type ParentCalendarCollection = ResponseData<'list_calendars_parent_calendars'>;

/** List Calendars: Parent Calendars */
export async function list({ 
    parent_id, 
    header,
    ...rest
}: EndpointOptions<'list_calendars_parent_calendars'>): Promise<ParentCalendarCollection> {
    const collection: ParentCalendarCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/calendars/parent_calendars/{parent_id}', {
            params: {
                path : { parent_id,  },
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
                `Error list of ParentCalendar at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}