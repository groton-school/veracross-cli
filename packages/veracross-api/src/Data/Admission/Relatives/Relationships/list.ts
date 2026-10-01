import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'admission.relatives.relationships:list';

export type RelativeRelationshipCollection = ResponseData<'list_admission_relative_relationships'>;

/** List Admission: Relative Relationships */
export async function list({ 
    relative_id, 
    header,
    ...rest
}: EndpointOptions<'list_admission_relative_relationships'>): Promise<RelativeRelationshipCollection> {
    const collection: RelativeRelationshipCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/admission/relatives/{relative_id}/relationships', {
            params: {
                path : { relative_id,  },
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
                `Error list of RelativeRelationship at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}