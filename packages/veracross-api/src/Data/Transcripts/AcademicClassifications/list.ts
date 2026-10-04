import { operations } from '#spec/Data-API.js';
import { client, defaults } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'transcripts.academic_classifications:list';

export type AcademicClassificationCollection = ResponseData<operations, 'list_transcripts_academic_classifications'>;

/** List Transcripts: Academic Classifications */
export async function list({ 
    person_id, 
    header,
    ...rest
}: EndpointOptions<operations, 'list_transcripts_academic_classifications'>): Promise<AcademicClassificationCollection> {
    const collection: AcademicClassificationCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/transcripts/{person_id}/academic_classifications', {
            params: {
                path : { person_id,  },
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
                `Error list of AcademicClassification at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}