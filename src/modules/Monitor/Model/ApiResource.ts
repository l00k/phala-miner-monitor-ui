import { AbstractModel } from '@/core/Store';
import { InitializerList, InitObject, Property } from '@100k/intiv-js-tools/InitializerList/index';


export enum ApiResourceStatus
{
    New = 'new',
    Fetching = 'fetching',
    Ready = 'ready',
}


@InitializerList()
export default class ApiResource
    extends AbstractModel
{

    @Property()
    public status : ApiResourceStatus = ApiResourceStatus.New;

    @Property()
    public lastUpdate : Date = new Date();

}
