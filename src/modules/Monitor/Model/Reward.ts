import { Model, AbstractModel } from '@/core/Store';
import { InitializerList, Property } from '@100k/intiv-js-tools/InitializerList';


export enum PayoutReason
{
    Online = 'online',
    Compute = 'compute',
}


@Model('Monitor/Reward')
@InitializerList()
export default class Reward
    extends AbstractModel<Reward>
{

    @Property()
    public fire : number = 0;

    @Property()
    public date : Date;

    @Property()
    public reason : PayoutReason;

    public get fireReadable() : string
    {
        return (this.fire / 1000000000000).toFixed(2) + ' tPHA';
    }

}
