import Account from '#/Monitor/Model/Account';
import Miner from '#/Monitor/Model/Miner';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import { Singleton, Inject } from '@100k/intiv/ObjectManager';
import { ToastProgrammatic as Toast } from 'buefy';


declare const window;

@Singleton()
export default class StorageMigration
{

    @Inject()
    protected monitorApi : MonitorApi;

    public get buildVersion() : string
    {
        return window.appData.buildVersion;
    }

    public get isOutdated() : boolean
    {
        const storageBuildVersion = window.localStorage.getItem('storageBuildVersion');
        return storageBuildVersion !== this.buildVersion;
    }

    public async migrate() : Promise<void>
    {
        if (confirm) {
            window.localStorage.clear();
            window.location.reload();
        }

        let result = true;

        const accounts = Account.findAll<Account>();
        for (const account of accounts) {
            const accountUpdated = await this.monitorApi.fetchNewAccount(account);
            if (!accountUpdated) {
                result = false;
            }
        }

        const miners = Miner.findAll<Miner>();
        for (const miner of miners) {
            const accountUpdated = await this.monitorApi.fetchNewMiner(miner);
            if (!accountUpdated) {
                result = false;
            }
        }

        if (result) {
            window.localStorage.setItem('storageBuildVersion', this.buildVersion);

            Toast.open({
                message: 'Local storage has been successfully migrated',
                type: 'is-success',
                position: 'is-bottom-right',
            });
        }
        else {
            Toast.open({
                message: 'Local storage could not be migrated',
                type: 'is-warning',
                position: 'is-bottom-right',
            });
        }
    }

    public async clear() : Promise<void>
    {
        if (confirm) {
            window.localStorage.clear();
            window.location.reload();
        }
    }

}
