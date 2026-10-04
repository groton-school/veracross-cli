import { operations } from '#spec/Files-API.js';
import { client, defaults } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'files:applicant_file:list';

export type ApplicantFileCollection = ResponseData<operations, 'list_admissions_applicant_files'>;

/** List Admissions: Applicant Files */
export async function list({ 
    header,
    ...rest
}: EndpointOptions<operations, 'list_admissions_applicant_files'>): Promise<ApplicantFileCollection> {
    const collection: ApplicantFileCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/applicant_file', {
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
                `Error list of ApplicantFile at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}