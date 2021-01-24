import { StoreModel } from '@/core/Store';
import { InitializerList, Property, InitObject } from '@100k/intiv-js-tools/InitializerList';

@StoreModel('Monitor/Account')
@InitializerList()
export default class Account
    extends InitObject<Account>
{

    @Property()
    public address : string;

    @Property()
    public balance : number = 0;

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

}
