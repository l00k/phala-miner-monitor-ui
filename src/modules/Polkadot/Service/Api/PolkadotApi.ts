import { ReleaseSymbol, Singleton } from '@100k/intiv-js-tools/ObjectManager';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { H256, Header } from '@polkadot/types/interfaces/runtime';
import { AnyFunction, AnyTuple } from '@polkadot/types/types';
import { ApiTypes, StorageEntryBase } from '@polkadot/api/types';


export type ApiModule = StorageEntryBase<ApiTypes, AnyFunction, AnyTuple>;

@Singleton()
export default class PolkadotApi
{

    protected static readonly API_WS_URL : string = 'wss://rpc.polkadot.io';

    protected wsProvider : WsProvider;

    protected api : ApiPromise;

    protected apiPromise : Promise<ApiPromise>;

    protected lastHeader : Header;

    public constructor()
    {
        const ParachainApi = <typeof PolkadotApi> this.constructor;
        const apiWsUrl = ParachainApi.API_WS_URL;

        this.wsProvider = new WsProvider(apiWsUrl);
        this.apiPromise = this.createApi();
    }

    public [ReleaseSymbol]()
    {
        this.wsProvider.disconnect();
    }

    protected createApi() : Promise<any>
    {
        return ApiPromise.create({ provider: this.wsProvider })
            .then((api) => this.bindApi(api));
    }

    protected async bindApi(api : ApiPromise)
    {
        this.api = api;
        this.lastHeader = await this.api.rpc.chain.getHeader();
    }

    public async queryAt<Result>(modulePath : string, blockHash : H256, ...args : any[]) : Promise<Result>
    {
        await this.apiPromise;
        const module = modulePath.split('.').reduce((o, key) => o && o[key] ? o[key] : null, <any> this.api.query);
        return <Promise<Result>> (<ApiModule> module).at(blockHash, ...args);
    }

    public async queryAtNow<Result>(modulePath : string, ...args : any[]) : Promise<Result>
    {
        await this.apiPromise;
        return this.queryAt(modulePath, this.lastHeader.hash, ...args);
    }

}
