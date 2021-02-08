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
    public fire : number;

    @Property()
    public date : Date;

    @Property()
    public reason : PayoutReason;

}
