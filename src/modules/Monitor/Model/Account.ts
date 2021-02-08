import Extrinsic from '#/Monitor/Model/Extrinsic';
import Reward from '#/Monitor/Model/Reward';
import { Model, AbstractModel } from '@/core/Store';
import { Initialize, Property } from '@100k/intiv/Initializable';


export enum AccountType
{
    PayoutTarget = 'payoutTarget',
    Miner = 'miner',
}


@Model('Monitor/Account')
export default class Account
    extends AbstractModel<Account>
{

    @Property()
    public address : string;

    @Property()
    public lastUpdate : Date;

    @Property()
    public name : string = '';

    @Property()
    public balance : number = 0;

    @Property()
    public fire : number = 0;

    @Property()
    public fireMined : number = 0;

    @Property()
    public isPayoutTarget : boolean = false;

    @Property()
    public isMiner : boolean = false;

    @Property({ arrayOf: Reward })
    public minedRewards : Reward[] = [];

    @Property({ arrayOf: Reward })
    public receivedRewards : Reward[] = [];

    @Property({ arrayOf: Extrinsic })
    public extrinsics : Extrinsic[] = [];

    public get types() : AccountType[]
    {
        const types = [];
        if (this.isPayoutTarget) {
            types.push(AccountType.PayoutTarget);
        }
        if (this.isMiner) {
            types.push(AccountType.Miner);
        }
        return types;
    }

}
