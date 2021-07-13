import { ReleaseSymbol } from '@100k/intiv/ObjectManager';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ApiTypes, StorageEntryBase } from '@polkadot/api/types';
import { AugmentedRpc } from '@polkadot/rpc-core/types';
import { H256 } from '@polkadot/types/interfaces/runtime';
import { AnyFunction, AnyTuple } from '@polkadot/types/types';


export type ApiModule = StorageEntryBase<ApiTypes, AnyFunction, AnyTuple>;


export default class PolkadotApi
{

    protected static readonly API_WS_URL : string = 'wss://rpc.polkadot.io';

    protected wsProvider : WsProvider;

    protected apiPromise : Promise<ApiPromise>;

    #api : ApiPromise;

    public async api() : Promise<ApiPromise>
    {
        await this.apiPromise;
        return this.#api;
    }

    public constructor()
    {
        const ParachainApi = <typeof PolkadotApi> this.constructor;
        const apiWsUrl = ParachainApi.API_WS_URL;

        this.wsProvider = new WsProvider(apiWsUrl);

        this.wsProvider.on('connected', () => {
            console.log('Connected to node.');
        });

        this.wsProvider.on('disconnected', () => {
            console.log('Disconnected from node.');
        });

        this.apiPromise = this.createApi();
    }

    public async [ReleaseSymbol]()
    {
        if (this.#api.isConnected) {
            await this.#api.disconnect();
        }
    }

    protected createApi() : Promise<any>
    {
        return ApiPromise.create({ provider: this.wsProvider })
            .then((api) => this.bindApi(api));
    }

    protected async bindApi(api : ApiPromise)
    {
        this.#api = api;
    }

    public async rpc<Result>(modulePath : string, ...args : any[]) : Promise<Result>
    {
        await this.apiPromise;

        const rpc = modulePath.split('.').reduce((o, key) => o && o[key] ? o[key] : null, <any> this.#api.rpc);
        return <Promise<Result>> (<AugmentedRpc<(...args : any[]) => any>> rpc)(...args);
    }

    public async queryAt<Result>(modulePath : string, block : string | number | H256, ...args : any[]) : Promise<Result>
    {
        await this.apiPromise;

        let blockHash = null;
        if (typeof block === 'string') {
            blockHash = this.#api.createType('H256', block);
        }
        else if (typeof block === 'number') {
            blockHash = await this.#api.rpc.chain.getBlockHash(block);
        }
        else {
            blockHash = block;
        }

        const module = modulePath.split('.').reduce((o, key) => o && o[key] ? o[key] : null, <any> this.#api.query);
        return <Promise<Result>> (<ApiModule> module).at(blockHash, ...args);
    }

    public async queryAtNow<Result>(modulePath : string, ...args : any[]) : Promise<Result>
    {
        await this.apiPromise;
        const lastHeader = await this.#api.rpc.chain.getHeader();
        return this.queryAt(modulePath, lastHeader.hash, ...args);
    }

}
