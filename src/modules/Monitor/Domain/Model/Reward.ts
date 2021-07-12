import { AbstractModel, Property } from '@/core/Domain/Model';
import { StorageModel } from '@/core/Store';
import gql from 'graphql-tag';


export enum PayoutReason
{
    Online = 'Online',
    Compute = 'Compute',
}

export const Fragments = {
    DefaultData: gql`
fragment RewardDefaultData on Reward {
    date,
    fire,
    reason,
}
`
};

@StorageModel('Monitor/Reward')
export default class Reward
    extends AbstractModel<Reward>
{

    @Property()
    public fire : number;

    @Property()
    public date : Date;

    @Property()
    public reason : PayoutReason;

    public constructor(data? : Partial<Reward>)
    {
        super();
        this.setData(data);
    }

}
