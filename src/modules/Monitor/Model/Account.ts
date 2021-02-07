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
    public recievedRewards : Reward[] = [];

    public get addressShort() : string
    {
        if (!this.address) {
            return '';
        }
        return this.address.substr(0, 8) + '...' + this.address.substr(-8);
    }

    public get balanceReadable() : string
    {
        return (this.balance / 1000000000000).toFixed(2) + ' tPHA';
    }

    public get fireReadable() : string
    {
        return (this.fire / 1000000000000).toFixed(2) + ' tPHA';
    }

    public get fireMinedReadable() : string
    {
        return (this.fireMined / 1000000000000).toFixed(2) + ' tPHA';
    }

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
