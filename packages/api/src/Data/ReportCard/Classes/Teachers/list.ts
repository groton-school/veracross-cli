import { operations } from '#spec/Data-API.js';
import { client, defaults } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'report_card.classes.teachers:list';

export type ClassTeacherCollection = ResponseData<operations, 'list_report_cards_class_teachers'>;

/** List Report Cards: Class Teachers */
export async function list({ 
    internal_class_id, 
    header,
    ...rest
}: EndpointOptions<operations, 'list_report_cards_class_teachers'>): Promise<ClassTeacherCollection> {
    const collection: ClassTeacherCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/report_card/classes/{internal_class_id}/teachers', {
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
                `Error list of ClassTeacher at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}