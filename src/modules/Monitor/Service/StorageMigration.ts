import Account from '#/Monitor/Domain/Model/Account';
import Miner from '#/Monitor/Domain/Model/Miner';
import AccountService from '#/Monitor/Domain/Service/AccountService';
import MinerService from '#/Monitor/Domain/Service/MinerService';
import MonitorApi from '#/Monitor/Service/MonitorApi';
import { StoreManager } from '@/core/Store';
import Repository from '@/core/Store/Repository';
import { Inject } from '@100k/intiv/ObjectManager';
import { v4 as uuidv4 } from 'uuid';
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

        // update storage name
        let requiresReload = false;

        let storageRaw = window.localStorage.getItem(StoreManager.STORAGE_KEY);
        if (storageRaw) {
            const storage = JSON.parse(storageRaw);

            Object.values(storage.Database.tables)
                .forEach((table : any) => {
                    for (const idx in table) {
                        if (
                            !table[idx][StoreManager.STORAGE_MODEL_PROPERTY]
                            && table[idx]['@modelName']
                        ) {
                            requiresReload = true;
                            table[idx][StoreManager.STORAGE_MODEL_PROPERTY] = table[idx]['@modelName'];
                            delete table[idx]['@modelName'];
                        }

                        if (!table[idx]['@uuid']) {
                            requiresReload = true;
                            table[idx]['@uuid'] = uuidv4();
                        }
                    }
                });

            storageRaw = JSON.stringify(storage);
            window.localStorage.setItem(StoreManager.STORAGE_KEY, storageRaw)
        }

        if (requiresReload) {
            window.location.reload();
            return;
        }

        // migrate accounts
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
