import Account from '#/Monitor/Domain/Model/Account';
import Miner from '#/Monitor/Domain/Model/Miner';
import AccountService from '#/Monitor/Domain/Service/AccountService';
import MinerService from '#/Monitor/Domain/Service/MinerService';
import MonitorApi from '#/Monitor/Service/MonitorApi';
import Repository from '@/core/Store/Repository';
import { Inject } from '@100k/intiv/ObjectManager';
import {
    ToastProgrammatic as Toast,
    SnackbarProgrammatic as Snackbar,
} from 'buefy';


declare const window;


export default class StorageMigration
{

    @Inject()
    protected accountService : AccountService;

    @Inject()
    protected minerService : MinerService;


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

        const accountRepository = Repository.get(Account);
        const minerRepository = Repository.get(Miner);

        const accounts = accountRepository.findAll<Account>();
        for (const account of accounts) {
            const accountUpdated = await this.accountService.fetchNew(account);
            if (!accountUpdated) {
                result = false;
            }
        }

        const miners = minerRepository.findAll<Miner>();
        for (const miner of miners) {
            const minerUpdated = await this.minerService.fetchNew(miner);
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
