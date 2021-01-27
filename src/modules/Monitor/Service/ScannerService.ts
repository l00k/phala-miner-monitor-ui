import Account, { AccountType } from '#/Monitor/Model/Account';
import Reward from '#/Monitor/Model/Reward';
import ParachainApi from '#/Phala/Service/Api/ParachainApi';
import SubscanApi from '#/Phala/Service/Api/SubscanApi';
import { Inject, Singleton } from '@100k/intiv-js-tools/ObjectManager';
import { ApiResourceStatus } from '../Model/ApiResource';


@Singleton()
export default class ScannerService
{

    protected static UPDATE_THRESHOLD = 3600;

    @Inject()
    protected subscanApi : SubscanApi;

    @Inject()
    protected parachainApi : ParachainApi;

    public async fetchSingle(account : Account, force : boolean = false) : Promise<void>
    {
        // const threshold = moment().subtract(ScannerService.UPDATE_THRESHOLD, 'seconds').toDate();
        // if (account.lastUpdate > threshold) {
        //     return;
        // }

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

        const updateFire = (account : Account) => {
            return new Promise(async(resolve, reject) => {
                try {
                    const result = await this.parachainApi.queryAtNow<any>('phalaModule.fire', account.address);
                    account.fire = parseFloat(result.toString());
                    resolve(true);
                }
                catch (e) {
                    reject(e);
                }
            });
        };

        promises.push(updateBalance(account));

        if (account.type === AccountType.Stash) {
            promises.push(updateFire(account));
        }

        const updateExtrinsics = async(account : Account) => {
            const batchSize = 100;

            const toUpdate = {
                lastExtrinsicBlock: null,
                lastExtrinsicDate: null,
                fire: 0,
                rewards: [],
            }

            // fetch all new extrinsics
            account.fetchingQueue = 0;

            const newExtrinsics = [];
            const promises = [];

            let done = false;
            for (let page = 1; !done; ++page) {
                const { data: { extrinsics: extrinsicsBatch } } = await this.subscanApi.getExtrinsics({
                    module: 'phalamodule',
                    call: 'sync_worker_message',
                    address: account.address,
                    row: batchSize,
                    page,
                });

                for (const extrinsic of extrinsicsBatch) {
                    if (extrinsic.block_num <= account.lastExtrinsicBlock) {
                        done = true;
                        break;
                    }

                    const promise = this.subscanApi.getExtrinsicDetails({ hash: extrinsic.extrinsic_hash, })
                        .then(({ data: extrinsicDetails }) => {
                            extrinsic.details = extrinsicDetails;
                            newExtrinsics.unshift(extrinsic);
                            --account.fetchingQueue;
                        });
                    promises.push(promise);

                    ++account.fetchingQueue;
                }

                await Promise.all(promises);

                if (extrinsicsBatch.length < batchSize) {
                    break;
                }
            }

            // update account
            for (const extrinsic of newExtrinsics) {
                const extrinsicDate = new Date(extrinsic.block_timestamp * 1000);
                account.lastExtrinsicDate = extrinsicDate;
                account.lastExtrinsicBlock = extrinsic.block_num;

                // search for Payout event
                const payoutEvent = extrinsic.details.event.find(event => event.event_id === 'Payout');
                if (payoutEvent) {
                    const params = JSON.parse(payoutEvent.params);
                    const balanceParam = params.filter(param => param.type === 'Balance')[0];
                    const fire = parseFloat(balanceParam.value);

                    const reward = new Reward({
                        fire,
                        date: extrinsicDate,
                    });

                    account.fire += fire;
                    account.rewards.push(reward);
                }
            }

        };

        if (account.type === AccountType.Controller) {
            promises.push(updateExtrinsics(account));
        }

        account.status = ApiResourceStatus.Fetching;

        await Promise.all(promises);

        account.status = ApiResourceStatus.Ready;
        account.lastUpdate = new Date();
        Account.persist(account);
    }

    public async fetch(accounts : Account[]) : Promise<void>
    {
        // get balances
        let promises : Promise<any>[] = [];

        const updateAccount = (account : Account) => {
            return new Promise(async(resolve, reject) => {
                try {
                    await this.fetchSingle(account);
                }
                catch (e) {
                    reject(e);
                }
            });
        };

        for (const account of accounts) {
            promises.push(updateAccount(account));
        }

        await Promise.all(promises);
    }

}
