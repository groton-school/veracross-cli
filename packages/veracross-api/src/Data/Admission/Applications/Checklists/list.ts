import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'admission.applications.checklists:list';

export type ApplicationChecklistCollection = ResponseData<'list_admission_application_checklists'>;

/** List Admission: Application Checklists */
export async function list({ 
    application_id, 
    header,
    ...rest
}: EndpointOptions<'list_admission_application_checklists'>): Promise<ApplicationChecklistCollection> {
    const collection: ApplicationChecklistCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/admission/applications/{application_id}/checklists', {
            params: {
                path : { application_id,  },
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
                `Error list of ApplicationChecklist at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}