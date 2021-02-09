import { Model, AbstractModel } from '@/core/Store';
import { Property } from '@100k/intiv/Initializable';


@Model('Monitor/Extrinsic')
export default class Extrinsic
    extends AbstractModel<Extrinsic>
{

    @Property()
    public action : string;

    @Property()
    public date : Date;

    @Property()
    public isSuccessful : boolean;

    public constructor(data? : Partial<Extrinsic>)
    {
        super();
        this.setData(data);
    }

}
