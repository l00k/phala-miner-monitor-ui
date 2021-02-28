import { Model, AbstractModel } from '@/core/Store';
import { Initializable, Property, Initialize } from '@100k/intiv/Initializable';
import gql from 'graphql-tag';


export enum PayoutReason
{
    Online = 'online',
    Compute = 'compute',
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


@Model('Monitor/Reward')
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
