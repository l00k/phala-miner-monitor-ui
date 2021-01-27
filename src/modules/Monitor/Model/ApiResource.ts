import { AbstractModel } from '@/core/Store';
import { InitializerList, InitObject, Property } from '@100k/intiv-js-tools/InitializerList/index';


export enum ApiResourceStatus
{
    New = 'new',
    Fetching = 'fetching',
    Ready = 'ready',
}


@InitializerList()
export default class ApiResource<T>
    extends AbstractModel<T>
{

    @Property()
    public status : ApiResourceStatus = ApiResourceStatus.New;

    @Property()
    public lastUpdate : Date;

    @Property()
    public fetchingQueue : number;

}
