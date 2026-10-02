import { client, defaults } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'report_card.enrollments.qualitative_grades:list';

export type QualitativeGradeCollection = ResponseData<'list_report_cards_qualitative_grades'>;

/** List Report Cards: Qualitative Grades */
export async function list({ 
    enrollment_id, 
    header,
    ...rest
}: EndpointOptions<'list_report_cards_qualitative_grades'>): Promise<QualitativeGradeCollection> {
    const collection: QualitativeGradeCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/report_card/enrollments/{enrollment_id}/qualitative_grades', {
            params: {
                path : { enrollment_id,  },
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
                `Error list of QualitativeGrade at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}