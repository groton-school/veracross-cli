import { operations } from '#spec/Data-API.js';
import { client, defaults } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'external_user_accounts:list';

export type ListExternalUserAccountCollection = ResponseData<operations, 'list_external_user_accounts'>;

/** List External User Accounts */
export async function list({ 
    header,
    ...rest
}: EndpointOptions<operations, 'list_external_user_accounts'>): Promise<ListExternalUserAccountCollection> {
    const collection: ListExternalUserAccountCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/external_user_accounts', {
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
                `Error list of ListExternalUserAccount at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}