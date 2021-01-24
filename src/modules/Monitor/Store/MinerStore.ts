import Miner from '#/Monitor/Model/Miner';
import Engine from '@/core/Engine';

import { StoreManager } from '@/core/Store';
import { ObjectManager } from '@100k/intiv-js-tools/ObjectManager';
import { v4 as uuidv4 } from 'uuid';
import { Module, Mutation, VuexModule } from 'vuex-module-decorators';


@Module({
    dynamic: true,
    store: ObjectManager.getInstance(Engine).getVuexStore(),
    preserveState: StoreManager.isModulePersisted('Monitor/Miner'),
    namespaced: true,
    name: 'Monitor/Miner',
})
export default class MinerStore
    extends VuexModule<MinerStore>
{

    public isLoading : boolean = false;

    public miners : Miner[] = [];

    @Mutation
    public setIsLoading(loading : boolean)
    {
        this.isLoading = loading;
    }

    @Mutation
    public async submitMiner(miner : Miner)
    {
        if (!miner.id) {
            miner.id = uuidv4();
        }

        const existing = this.miners.find(_miner => _miner.id === miner.id);
        if (existing) {
            Object.assign(existing, miner);
        }
        else {
            this.miners.push(miner);
        }
    }

    @Mutation
    public async deleteMiner(miner : Miner)
    {
        const index = this.miners.findIndex(_miner => _miner.id === miner.id);
        if (index !== -1) {
            this.miners.splice(index, 1);
        }
    }

}
