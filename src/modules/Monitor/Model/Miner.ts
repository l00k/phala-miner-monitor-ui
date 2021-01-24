import Account from '#/Monitor/Model/Account';
import { StoreModel } from '@/core/Store';
import { InitializerList, Property, InitObject } from '@100k/intiv-js-tools/InitializerList';


export enum MinerStatus
{
    Ready = 'ready',
    Loading = 'loading',
}


@StoreModel('Monitor/Miner')
@InitializerList()
export default class Miner
    extends InitObject<Account>
{

    @Property()
    public id : string;

    @Property()
    public name : string;

    @Property()
    public accountStash : Account = new Account();

    @Property()
    public accountController : Account = new Account();

    @Property()
    public nodeIp : string;

    @Property()
    public fire : number = 0;

    @Property()
    public status : MinerStatus = MinerStatus.Ready;

    public get fireReadable() : string
    {
        return (this.fire / 1000000000000).toFixed(2) + ' tPHA';
    }

}
