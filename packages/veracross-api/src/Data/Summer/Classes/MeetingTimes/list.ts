import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'summer.classes.meeting_times:list';

export type ClassMeetingTimeCollection = ResponseData<'list_summer_class_meeting_times'>;

/** List Summer: Class Meeting Times */
export async function list({ 
    internal_class_id, 
    header,
    ...rest
}: EndpointOptions<'list_summer_class_meeting_times'>): Promise<ClassMeetingTimeCollection> {
    const collection: ClassMeetingTimeCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/summer/classes/{internal_class_id}/meeting_times', {
            params: {
                path : { internal_class_id,  },
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
                `Error list of ClassMeetingTime at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}