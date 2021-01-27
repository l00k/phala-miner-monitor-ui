import AbstractService from '@/core/Service/AbstractService';
import { Singleton } from '@100k/intiv-js-tools/ObjectManager';
import { AxiosRequestConfig } from 'axios';


export type SubscanResult = {
    code : number,
    message : string,
    ttl : number,
    data : {
        [index : string] : any
    }
};

@Singleton()
export default class SubscanApi
    extends AbstractService
{

    protected static readonly BASE_URL : string = 'http://localhost:8010/proxy/api/';

    public async getExtrinsics(params : any = {}, config : AxiosRequestConfig = {}) : Promise<SubscanResult>
    {
        params = {
            page: 1,
            row: 25,
            ...params
        };

        config = {
            withCredentials: false,
            ...config,
        };

        return await this.http.post('scan/extrinsics', params, config)
            .then((response) => response.data);
    }

    public async getExtrinsicDetails(params : any = {}, config : AxiosRequestConfig = {}) : Promise<SubscanResult>
    {
        config = {
            withCredentials: false,
            ...config,
        };

        return await this.http.post('scan/extrinsic', params, config)
            .then((response) => response.data);
    }

}
