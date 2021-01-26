import Account from '#/Monitor/Model/Account';
import ApiResource from '#/Monitor/Model/ApiResource';
import { Model } from '@/core/Store';
import { InitializerList, Property } from '@100k/intiv-js-tools/InitializerList';


export enum MinerStatus
{
    Ready = 'ready',
    Loading = 'loading',
}


@Model('Monitor/Miner')
@InitializerList()
export default class Miner
    extends ApiResource
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

}
