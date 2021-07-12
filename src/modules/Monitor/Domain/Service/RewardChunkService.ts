import DateTimeInterval from '#/Monitor/Domain/Model/DateTimeInterval';
import RewardChunk, { Fragments as RewardChunkFragments } from '#/Monitor/Domain/Model/RewardChunk';
import MonitorApi from '#/Monitor/Service/MonitorApi';
import { Pagination } from '@/core/GraphQL/Struct';
import { Inject } from '@100k/intiv/ObjectManager';
import gql from 'graphql-tag';


type RewardChunkParams = {
    minerId : number,
    groupBy? : DateTimeInterval,
};

export default class RewardChunkService
{

    @Inject()
    protected monitorApi : MonitorApi;

    public async find(
        params : RewardChunkParams,
        pagination : Pagination = new Pagination({ itemsPerPage: 500 }),
    ) : Promise<RewardChunk[]>
    {
        const { rewardChunksRaw } = await this.monitorApi.query(gql`
            query (
                $minerId : Int!,
                $groupBy : DateTimeInterval!,
                $pagination : RewardChunkPagination
            ) { 
                rewardChunksRaw: getMinerRewards(
                    minerId: $minerId,
                    groupBy: $groupBy,
                    pagination: $pagination
                ) { 
                    ...RewardChunkDefaultData
                }
            }
            ${ RewardChunkFragments.DefaultData }
        `, {
            ...params,
            pagination: pagination.serialize({ includeGroups: [ 'api' ] }),
        });
        if (!rewardChunksRaw) {
            return [];
        }

        return rewardChunksRaw.map(raw => new RewardChunk(raw));
    }

}
