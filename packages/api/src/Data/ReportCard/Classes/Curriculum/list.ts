import { operations } from '#spec/Data-API.js';
import { client, defaults } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'report_card.classes.curriculum:list';

export type ClassCurriculumCollection = ResponseData<operations, 'list_report_cards_class_curriculum'>;

/** List Report Cards: Class Curriculum */
export async function list({ 
    internal_class_id, 
    header,
    ...rest
}: EndpointOptions<operations, 'list_report_cards_class_curriculum'>): Promise<ClassCurriculumCollection> {
    const collection: ClassCurriculumCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/report_card/classes/{internal_class_id}/curriculum', {
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
                `Error list of ClassCurriculum at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}