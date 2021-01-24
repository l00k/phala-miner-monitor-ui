import AbstractService from '@/core/Service/AbstractService';
import { Singleton } from '@100k/intiv-js-tools/ObjectManager';


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

    protected static readonly BASE_URL : string = 'https://phala.subscan.io/api/';

    public async getExtincts(data : any = {}, config : any = {}) : Promise<SubscanResult>
    {
        data = {
            page: 0,
            row: 25,
            _: (new Date().getTime()),
            ...data
        };

        config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
            ...config
        };

        return await this.http.post('scan/extrinsics', data, config)
            .then((response) => response.data);
    }

}
