import { InitializerList, InitObject, Property } from '@100k/intiv-js-tools/InitializerList/index';
import { Model } from '@vuex-orm/core';
import { v4 as uuidv4 } from 'uuid';


export enum ApiResourceStatus
{
    New = 'new',
    Fetching = 'fetching',
    Ready = 'ready',
}


export default class ApiResource
    extends Model
{

    public status : ApiResourceStatus = ApiResourceStatus.New;

    public lastUpdate : Date = new Date();

}
