import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'academics.assignments.grades:list';

export type AssignmentGradeCollection = ResponseData<'list_academics_assignment_grades'>;

/** List Academics: Assignment Grades */
export async function list({ 
    assignment_id, 
    header,
    ...rest
}: EndpointOptions<'list_academics_assignment_grades'>): Promise<AssignmentGradeCollection> {
    const collection: AssignmentGradeCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/academics/assignments/{assignment_id}/grades', {
            params: {
                path : { assignment_id,  },
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
                `Error list of AssignmentGrade at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}