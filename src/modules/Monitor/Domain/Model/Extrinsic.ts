import { AbstractModel, Property } from '@/core/Domain/Model';
import { StorageModel } from '@/core/Store';


@StorageModel('Monitor/Extrinsic')
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
