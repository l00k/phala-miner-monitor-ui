import Account from '#/Monitor/Model/Account';
import ParachainApi from '#/Phala/Service/Api/ParachainApi';

import SubscanApi from '#/Phala/Service/Api/SubscanApi';
import { Inject, Singleton } from '@100k/intiv-js-tools/ObjectManager';
import Miner, { MinerStatus } from '../Model/Miner';


@Singleton()
export default class ScannerService
{

    @Inject()
    protected subscanApi : SubscanApi;

    @Inject()
    protected parachainApi : ParachainApi;

    @Inject()
    protected console : Console;



    public async fetchSingle(miner : Miner): Promise<void>
    {
        // get balances
        let promises : Promise<any>[] = [];

        const updateBalance = (account : Account) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await this.parachainApi.queryAtNow<any>('system.account', account.address);
                    account.balance = parseFloat(result.data.free.toString());
                    resolve(true);
                }
                catch(e) {
                    reject(e);
                }
            })
        }

        const updateFire = (miner : Miner) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await this.parachainApi.queryAtNow<any>('phalaModule.fire', miner.accountStash.address);
                    miner.fire = parseFloat(result.toString());
                    resolve(true);
                }
                catch(e) {
                    reject(e);
                }
            })
        }

        if (miner.accountStash.address) {
            promises.push(updateBalance(miner.accountStash));
            promises.push(updateFire(miner));
        }
        if (miner.accountController.address) {
            promises.push(updateBalance(miner.accountController));
        }

        miner.status = MinerStatus.Loading;
        await Promise.all(promises);
        miner.status = MinerStatus.Ready;
    }

    public async fetch(miners : Miner[]): Promise<void>
    {
        // get balances
        let promises : Promise<any>[] = [];

        const updateMiner = (miner : Miner) => {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.fetchSingle(miner);
                }
                catch(e) {
                    reject(e);
                }
            })
        }

        for (const miner of miners) {
            promises.push(updateMiner(miner));
        }

        await Promise.all(promises);
    }

}
