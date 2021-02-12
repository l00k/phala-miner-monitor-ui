import App from '@/core/App';
import { StoreManager } from '@/core/Store';
import { ObjectManager } from '@100k/intiv/ObjectManager';
import { Module, VuexModule, Mutation, MutationAction } from 'vuex-module-decorators';

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

    public storageBuildVersion : string;

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

    @MutationAction({ mutate: [ 'visibleColumns' ] })
    public async setVisibleColumns(visibleColumns)
    {
        return {
            visibleColumns
        }
    }

}