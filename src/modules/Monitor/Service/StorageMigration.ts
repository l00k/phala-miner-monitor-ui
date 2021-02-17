import Account from '#/Monitor/Model/Account';
import Miner from '#/Monitor/Model/Miner';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import { Inject } from '@100k/intiv/ObjectManager';
import {
    ToastProgrammatic as Toast,
    SnackbarProgrammatic as Snackbar,
} from 'buefy';


declare const window;


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
            const minerUpdated = await this.monitorApi.fetchNewMiner(miner);
            if (!minerUpdated) {
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

        Snackbar.open({
            message: 'Your local storage data was updated. App migrated it to latest version, but it may happen monitor will not work properly. In such case try to clear local storage (check config section)',
            type: 'is-warning',
            position: 'is-top',
            actionText: 'Hide',
            indefinite: true,
        });
    }

    public async clear() : Promise<void>
    {
        window.localStorage.clear();
        window.location.reload();
    }

}
