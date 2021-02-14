import App from '@/core/App';
import { StoreManager } from '@/core/Store';
import { ObjectManager } from '@100k/intiv/ObjectManager';
import { State } from 'vuex-class';
import { Module, VuexModule, MutationAction, Mutation } from 'vuex-module-decorators';


@Module({
    dynamic: true,
    store: ObjectManager.getInstance(App).getVuexStore(),
    preserveState: StoreManager.isModulePersisted('Monitor/Config'),
    namespaced: true,
    name: 'Monitor/Config',
})
export default class ContextStore
    extends VuexModule<ContextStore>
{

    public visibleColumns : string[] = [
        'name',
        'address',
        'score',
        'state',
        'commission',
        'stake',
        'balance',
        'fireMined',
        'lastExtrinsics',
        'lastRewards'
    ];

    @Mutation
    public async setVisibleColumns(visibleColumns : string[])
    {
        this.visibleColumns = visibleColumns;
    }

}
