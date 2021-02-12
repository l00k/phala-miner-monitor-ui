import Extrinsic from '#/Monitor/Model/Extrinsic';
import Reward from '#/Monitor/Model/Reward';
import { Model, AbstractModel } from '@/core/Store';
import { Property } from '@100k/intiv/Initializable';


@Model('Monitor/Account')
export default class Account
    extends AbstractModel<Account>
{

    @Property()
    public address : string;

    @Property()
    public name : string = '';

    @Property()
    public balance : number = 0;

    @Property()
    public fire : number = 0;

    @Property({ arrayOf: Extrinsic })
    public extrinsics : Extrinsic[] = [];

    @Property({ arrayOf: Reward })
    public receivedRewards : Reward[] = [];

    @Property()
    public updatedAt : Date;

    public constructor(data? : Partial<Account>)
    {
        super();
        this.setData(data);
    }

}
