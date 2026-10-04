import { operations } from '#spec/Data-API.js';
import { client, defaults } from '#Data/client.js';
import { EndpointOptions } from '#types/EndpointOptions.js';
import { ResponseData } from '#types/ResponseBody.js';

export const LIST_SCOPE = 'athletics.team.practice_schedules:list';

export type TeamPracticeScheduleCollection = ResponseData<operations, 'list_athletics_team_practice_schedules'>;

/** List Athletics: Team Practice Schedules */
export async function list({ 
    id, 
    header,
    ...rest
}: EndpointOptions<operations, 'list_athletics_team_practice_schedules'>): Promise<TeamPracticeScheduleCollection> {
    const collection: TeamPracticeScheduleCollection = [];
    let page = !!header && header['X-Page-Number'] ?
        header['X-Page-Number'] :
        1;
    const page_size = !!header && header['X-Page-Size'] ?
        header['X-Page-Size'] :
        defaults().DEFAULT_PAGE_SIZE;
    let done: boolean;
    do {
        const {data,error} = await client().GET('/athletics/team/{id}/practice_schedules', {
            params: {
                path : { id,  },
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
                `Error list of TeamPracticeSchedule at page ${page}`,
                { cause: error }
            );
        }
        collection.push(...data.data);
        page++;
        done = data.data.length < page_size;
    } while (!done);
    return collection;
}