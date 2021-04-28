import PolkadotApi from '#/Polkadot/Service/Api/PolkadotApi';
import { ApiPromise } from '@polkadot/api';
import PhalaParachainTypes from '../../etc/phala-types.json';


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
            types: PhalaParachainTypes,
        }).then((api) => this.bindApi(api));
    }

}
