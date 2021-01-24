import { Singleton } from '@100k/intiv-js-tools/ObjectManager';
import { ApiPromise } from '@polkadot/api';

import PolkadotApi from '#/Polkadot/Service/Api/PolkadotApi';

import PhalaParachainTypes from '../../etc/phala-types.json';


@Singleton()
export default class ParachainApi
    extends PolkadotApi
{

    protected static readonly API_WS_URL : string = 'wss://poc3a.phala.network/ws';

    protected createApi() : Promise<any>
    {
        return ApiPromise.create({
            provider: this.wsProvider,
            types: <any> PhalaParachainTypes,
        }).then((api) => this.bindApi(api));
    }

}
