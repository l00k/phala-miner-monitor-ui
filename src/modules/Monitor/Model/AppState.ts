import Extrinsic from '#/Monitor/Model/Extrinsic';
import Reward from '#/Monitor/Model/Reward';
import { Model, AbstractModel } from '@/core/Store';
import { Property } from '@100k/intiv/Initializable';
import gql from 'graphql-tag';


@Model('Monitor/AppState')
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
