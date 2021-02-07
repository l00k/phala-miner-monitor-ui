import { Model, AbstractModel } from '@/core/Store';
import { Initializable, Property, Initialize } from '@100k/intiv/Initializable';


export enum PayoutReason
{
    Online = 'online',
    Compute = 'compute',
}


@Model('Monitor/Reward')
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
