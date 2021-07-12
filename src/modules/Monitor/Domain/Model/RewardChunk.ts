import { AbstractModel, Property } from '@/core/Domain/Model';
import { StorageModel } from '@/core/Store';
import gql from 'graphql-tag';


export const Fragments = {
    DefaultData: gql`
fragment RewardChunkDefaultData on RewardChunk {
    chunkStamp
    date
    rewardNumber
    rewardValue
    reason
}
`
};

@StorageModel('Monitor/RewardChunk')
export default class RewardChunk
    extends AbstractModel<RewardChunk>
{

    @Property()
    public chunkStamp : number;

    @Property()
    public date : Date;

    @Property()
    public rewardNumber : number;

    @Property()
    public rewardValue : bigint = BigInt(0);

    @Property()
    public reason : string;

}
