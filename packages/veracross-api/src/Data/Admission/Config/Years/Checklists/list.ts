import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'admission.config.years.checklists:list';

export type ConfigurationChecklistCollection = ResponseData<'list_admission_configuration_checklists'>;

/** List Admission: Configuration - Checklists */
export async function list({ 
    school_year, 
    header,
    ...rest
}: EndpointOptions<'list_admission_configuration_checklists'>): Promise<ConfigurationChecklistCollection> {
    const collection: ConfigurationChecklistCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/admission/config/years/{school_year}/checklists', {
            params: {
                path : { school_year,  },
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
                `Error list of ConfigurationChecklist at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}