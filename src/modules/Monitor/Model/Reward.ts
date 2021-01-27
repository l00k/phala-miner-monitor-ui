import ApiResource from '#/Monitor/Model/ApiResource';
import { Model, AbstractModel } from '@/core/Store';
import { InitializerList, Property } from '@100k/intiv-js-tools/InitializerList';


@Model('Monitor/Reward')
@InitializerList()
export default class Reward
    extends AbstractModel<Reward>
{

    @Property()
    public fire : number = 0;

    @Property()
    public date : Date;

    public get fireReadable() : string
    {
        return (this.fire / 1000000000000).toFixed(2) + ' tPHA';
    }

}
