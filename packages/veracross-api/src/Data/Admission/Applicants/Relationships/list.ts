import { client, defaults } from '#Client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'admission.applicants.relationships:list';

export type ApplicantRelationshipCollection = ResponseData<'list_admission_applicant_relationships'>;

/** List Admission: Applicant Relationships */
export async function list({ 
    applicant_id, 
    header,
    ...rest
}: EndpointOptions<'list_admission_applicant_relationships'>): Promise<ApplicantRelationshipCollection> {
    const collection: ApplicantRelationshipCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/admission/applicants/{applicant_id}/relationships', {
            params: {
                path : { applicant_id,  },
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
                `Error list of ApplicantRelationship at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}