import Extrinsic from '#/Monitor/Domain/Model/Extrinsic';
import Reward from '#/Monitor/Domain/Model/Reward';
import { AbstractModel, Property } from '@/core/Domain/Model';
import { StorageModel } from '@/core/Store';
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

@StorageModel('Monitor/Account')
export default class Account
    extends AbstractModel<Account>
{

    @Property()
    public id : number;

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
