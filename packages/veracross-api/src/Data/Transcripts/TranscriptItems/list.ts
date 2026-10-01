import { client, defaults } from '@/Client.js';
import { EndpointOptions } from '@/types/EndpointOptions.js';
import { ResponseData } from '@/types/ResponseBody.js';

export const LIST_SCOPE = 'transcripts.transcript_items:list';

export type TranscriptItemCollection = ResponseData<'list_transcripts_transcript_items'>;

/** List Transcripts: Transcript Items */
export async function list({ 
    person_id, 
    header,
    ...rest
}: EndpointOptions<'list_transcripts_transcript_items'>): Promise<TranscriptItemCollection> {
    const collection: TranscriptItemCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/transcripts/{person_id}/transcript_items', {
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
                `Error list of TranscriptItem at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}