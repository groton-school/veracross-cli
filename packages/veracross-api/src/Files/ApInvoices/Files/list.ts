import { operations } from '#spec/Files-API.js';
import { client, defaults } from '#Files/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'files:ap_invoices.files:list';

export type APInvoiceFileCollection = ResponseData<operations, 'list_finance_ap_invoice_files'>;

/** List Finance: AP Invoice Files */
export async function list({ 
    invoice_id, 
    header,
    ...rest
}: EndpointOptions<operations, 'list_finance_ap_invoice_files'>): Promise<APInvoiceFileCollection> {
    const collection: APInvoiceFileCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/ap_invoices/{invoice_id}/files', {
            params: {
                path : { invoice_id,  },
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
                `Error list of APInvoiceFile at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}