import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'student_logistics.drop_ins:list';

export type DropInCollection = ResponseData<'list_student_logistics_requests_drop_ins'>;

/** List Student Logistics Requests: Drop-Ins */
export async function list({ 
    header,
    ...rest
}: EndpointOptions<'list_student_logistics_requests_drop_ins'>): Promise<DropInCollection> {
    const collection: DropInCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/student_logistics/drop_ins', {
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
                `Error list of DropIn at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}