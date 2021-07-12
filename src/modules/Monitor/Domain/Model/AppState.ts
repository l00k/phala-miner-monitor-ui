import Extrinsic from '#/Monitor/Domain/Model/Extrinsic';
import { AbstractModel, Property } from '@/core/Domain/Model';
import { StorageModel } from '@/core/Store';
import gql from 'graphql-tag';


@StorageModel('Monitor/AppState')
export default class AppState
    extends AbstractModel<AppState>
{

    @Property()
    public currentHeadBlock : number;

    @Property()
    public lastFetchedBlock : number;

    @Property()
    public lastInfoUpdateBlock : number;

    public constructor(data? : Partial<AppState>)
    {
        super();
        this.setData(data);
    }

}
