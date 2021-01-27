import ApiResource from '#/Monitor/Model/ApiResource';
import Reward from '#/Monitor/Model/Reward';
import { Model } from '@/core/Store';
import { InitializerList, Property } from '@100k/intiv-js-tools/InitializerList';


export enum AccountType
{
    Stash = 'stash',
    Controller = 'controller',
}


@Model('Monitor/Account')
@InitializerList()
export default class Account
    extends ApiResource<Account>
{

    @Property()
    public type : AccountType;

    @Property()
    public address : string;

    @Property()
    public name : string;

    @Property()
    public balance : number = 0;

    @Property()
    public fire : number = 0;

    @Property()
    public lastExtrinsicDate : Date;

    @Property()
    public lastExtrinsicBlock : number = 0;

    @Property({ arrayOf: Reward })
    public rewards : Reward[] = [];

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

}
