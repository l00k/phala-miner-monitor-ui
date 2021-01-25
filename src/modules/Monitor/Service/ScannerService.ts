import Account from '#/Monitor/Model/Account';
import ParachainApi from '#/Phala/Service/Api/ParachainApi';
import SubscanApi from '#/Phala/Service/Api/SubscanApi';
import { Inject, Singleton } from '@100k/intiv-js-tools/ObjectManager';
import moment from 'moment';
import Miner from '../Model/Miner';
import { ApiResourceStatus }  from '../Model/ApiResource';


@Singleton()
export default class ScannerService
{

    protected static UPDATE_THRESHOLD = 3600;

    @Inject()
    protected subscanApi : SubscanApi;

    @Inject()
    protected parachainApi : ParachainApi;

    @Inject()
    protected console : Console;

    public async fetchSingle(miner : Miner, force : boolean = false) : Promise<void>
    {
        const threshold = moment().subtract(ScannerService.UPDATE_THRESHOLD, 'seconds').toDate();

        // get balances
        const promises : Promise<any>[] = [];

        const updateBalance = (account : Account) => {
            return new Promise(async(resolve, reject) => {
                try {
                    const result = await this.parachainApi.queryAtNow<any>('system.account', account.address);
                    account.balance = parseFloat(result.data.free.toString());
                    resolve(true);
                }
                catch (e) {
                    reject(e);
                }
            });
        };

        const updateFire = (miner : Miner) => {
            return new Promise(async(resolve, reject) => {
                try {
                    const result = await this.parachainApi.queryAtNow<any>('phalaModule.fire', miner.accountStash.address);
                    miner.accountStash.fire = parseFloat(result.toString());
                    resolve(true);
                }
                catch (e) {
                    reject(e);
                }
            });
        };

        if (miner.accountStash.address) {
            promises.push(updateBalance(miner.accountStash));
            promises.push(updateFire(miner));
        }
        if (miner.accountController.address) {
            promises.push(updateBalance(miner.accountController));
        }

        miner.status = ApiResourceStatus.Fetching;
        await Promise.all(promises);
        miner.status = ApiResourceStatus.Ready;
    }

    public async fetch(miners : Miner[]) : Promise<void>
    {
        // get balances
        let promises : Promise<any>[] = [];

        const updateMiner = (miner : Miner) => {
            return new Promise(async(resolve, reject) => {
                try {
                    await this.fetchSingle(miner);
                }
                catch (e) {
                    reject(e);
                }
            });
        };

        for (const miner of miners) {
            promises.push(updateMiner(miner));
        }

        await Promise.all(promises);
    }

}
