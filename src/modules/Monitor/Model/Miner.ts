import Extrinsic from '#/Monitor/Model/Extrinsic';
import Account from '#/Monitor/Model/Account';
import Reward from '#/Monitor/Model/Reward';
import { Model, AbstractModel } from '@/core/Store';
import { Property } from '@100k/intiv/Initializable';
import gql from 'graphql-tag';


export const Fragments = {
    MinerDefaultData: gql`
fragment MinerDefaultData on Miner {
    id,
    controllerAccount {
        address,
        balance,
        fire,
        extrinsics {
            date,
            action,
            isSuccessful
        },
    }
    stashAccount {
        address,
        balance,
        fire,
        extrinsics {
            date,
            action,
            isSuccessful
        },
    }
    fireMined,
    score,
    stake,
    state,
    commission,
    minedRewards {
        date,
        fire,
        reason
    }
}
`
}


@Model('Monitor/Miner')
export default class Miner
    extends AbstractModel<Miner>
{

    @Property()
    public stashAccount : Account = new Account();

    @Property()
    public controllerAccount : Account = new Account();

    @Property()
    public payoutTarget : Account = new Account();

    @Property()
    public name : string = '';

    @Property({ arrayOf: Reward })
    public minedRewards : Reward[] = [];

    @Property()
    public fireMined : number = 0;

    @Property()
    public state : string;

    @Property()
    public score : number;

    @Property()
    public stake : number;

    @Property()
    public commisson : number;

    @Property()
    public updatedAt : Date;

    public constructor(data? : Partial<Account>)
    {
        super();
        this.setData(data);
    }

}
