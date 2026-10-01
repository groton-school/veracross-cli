import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'finance.ap_disbursements:list';

export type ApDisbursementCollection = ResponseData<'list_finance_ap_disbursements'>;

/** List Finance: AP Disbursements */
export async function list({ 
    header,
    ...rest
}: EndpointOptions<'list_finance_ap_disbursements'>): Promise<ApDisbursementCollection> {
    const collection: ApDisbursementCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/finance/ap_disbursements', {
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
                `Error list of ApDisbursement at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}