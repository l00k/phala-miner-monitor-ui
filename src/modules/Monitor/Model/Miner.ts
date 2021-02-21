import Account from '#/Monitor/Model/Account';
import DeviceState from '#/Monitor/Model/DeviceState';
import Reward from '#/Monitor/Model/Reward';
import { Model, AbstractModel } from '@/core/Store';
import { Property } from '@100k/intiv/Initializable';
import gql from 'graphql-tag';
import moment from 'moment';
import { isEmpty } from 'lodash';


export const Fragments = {
    DefaultData: gql`
fragment MinerDefaultData on Miner {
    id,
    controllerAccount {
        address,
        balance,
        fire,
        stake,
        extrinsics {
            date,
            action,
            isSuccessful,
        },
    },
    stashAccount {
        address,
        balance,
        fire,
        stake,
        extrinsics {
            date,
            action,
            isSuccessful,
        },
    },
    fireMined,
    score,
    state,
    commission,
    minedRewards {
        date,
        fire,
        reason,
    },
    deviceState {
        cpu { temperature },
        node { state, syncProgress },
        runtime { state },
        host { state },
        updatedAt,
    }
}
`
};


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

    @Property({ arrayOf: Reward })
    public minedRewards : Reward[] = [];

    @Property()
    public fireMined : number = 0;

    @Property()
    public state : string;

    @Property()
    public score : number;

    @Property()
    public commisson : number;

    @Property()
    public deviceState : DeviceState;

    @Property()
    public updatedAt : Date;


    @Property()
    public name : string = '';

    @Property()
    public isVisible : boolean = true;

    @Property()
    public isUnknown : boolean = true;


    public get isOnline() : boolean
    {
        return !isEmpty(this.controllerAccount.extrinsics)
            && moment().diff(this.controllerAccount.extrinsics[0].date, 'hours') < 2;
    }

    public get isRewarding() : boolean
    {
        return !isEmpty(this.minedRewards)
            && moment().diff(this.minedRewards[0].date, 'hours') < 2;
    }


    public constructor(data? : Partial<Miner>)
    {
        super();
        this.setData(data);
    }

}
