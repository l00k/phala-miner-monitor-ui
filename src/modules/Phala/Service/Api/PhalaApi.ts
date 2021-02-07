import PolkadotApi from '#/Polkadot/Service/Api/PolkadotApi';
import { Singleton } from '@100k/intiv/ObjectManager';
import { ApiPromise } from '@polkadot/api';
import PhalaParachainTypes from '../../etc/phala-types.json';


@Singleton()
export default class PhalaApi
    extends PolkadotApi
{

    protected static readonly API_WS_URL : string = 'ws://10.147.17.79:9944/ws';

    protected createApi() : Promise<any>
    {
        return ApiPromise.create({
            provider: this.wsProvider,
            types: PhalaParachainTypes,
        }).then((api) => this.bindApi(api));
    }

}
