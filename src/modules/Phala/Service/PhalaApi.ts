import PolkadotApi from '#/Polkadot/Service/PolkadotApi';
import { ApiPromise } from '@polkadot/api';
import { dev } from '@phala/typedefs';


const env = process.env.NODE_ENV || 'production';
const isDev = env !== 'production';


export default class PhalaApi
    extends PolkadotApi
{

    protected static readonly API_WS_URL : string = 'wss://poc4.phala.network/ws';

    protected createApi() : Promise<any>
    {
        return ApiPromise.create({
            provider: this.wsProvider,
            types: dev,
        }).then((api) => this.bindApi(api));
    }

}
