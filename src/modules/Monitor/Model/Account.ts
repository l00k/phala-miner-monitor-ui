import Extrinsic from '#/Monitor/Model/Extrinsic';
import Reward from '#/Monitor/Model/Reward';
import { Model, AbstractModel } from '@/core/Store';
import { Property } from '@100k/intiv/Initializable';
import gql from 'graphql-tag';


export const Fragments = {
    DefaultData: gql`
fragment AccountDefaultData on Account {
    id,
    address,
    balance,
    fire,
    stake,
    extrinsics {
        date,
        action,
        isSuccessful
    },
    receivedRewards {
        date,
        fire,
        reason
    }
}
`
};

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

    @Property()
    public stake : number = 0;

    @Property({ arrayOf: Extrinsic })
    public extrinsics : Extrinsic[] = [];

    @Property({ arrayOf: Reward })
    public receivedRewards : Reward[] = [];

    @Property()
    public updatedAt : Date;


    @Property()
    public isUnknown : boolean = true;

    public constructor(data? : Partial<Account>)
    {
        super();
        this.setData(data);
    }

}
