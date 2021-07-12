import Account, { Fragments as AccountFragments } from '#/Monitor/Domain/Model/Account';
import DateTimeInterval from '#/Monitor/Domain/Model/DateTimeInterval';
import PayoutTargetSecretKeyData from '#/Monitor/Dto/PayoutTargetSecretKeyData';
import MonitorApi from '#/Monitor/Service/MonitorApi';
import { Inject } from '@100k/intiv/ObjectManager';
import gql from 'graphql-tag';


type RewardChunkParams = {
    minerId : number,
    groupBy? : DateTimeInterval,
};

export default class AccountService
{

    @Inject()
    protected monitorApi : MonitorApi;

    public async fetch(accounts : Account[] = []) : Promise<boolean>
    {
        const ids = accounts
            .map(account => account.id)
            .filter(id => !!id);
        if (!ids.length) {
            return true;
        }

        const idJson = JSON.stringify(ids);

        const { rawAccounts } = await this.monitorApi.query(gql`
            query (
                $ids: [Int!]
            ) { 
                rawAccounts: getAccounts(
                    ids: $ids
                ) { 
                    ...AccountDefaultData 
                }
            }
            ${ AccountFragments.DefaultData }
        `, {
            ids
        });

        accounts.forEach(account => account.isUnknown = true);

        if (!rawAccounts || !rawAccounts.length) {
            return false;
        }

        for (const rawAccount of rawAccounts) {
            const account = accounts.find(_miner => _miner.id === rawAccount.id);
            if (account) {
                account.setData(rawAccount);
                account.isUnknown = false;
            }
        }

        return true;
    }

    public async fetchNew(account : Account) : Promise<boolean>
    {
        const { rawAccount } = await this.monitorApi.query(gql`
            query (
                $address : String
            ) { 
                rawAccount: getAccount(
                    address: $address
                ) { 
                    ...AccountDefaultData
                }
            }
            ${ AccountFragments.DefaultData }
        `, {
            address: account.address
        });

        account.isUnknown = !rawAccount;

        if (!rawAccount) {
            return false;
        }

        account.setData(rawAccount);

        return true;
    }

    public async mutatePayoutTargetSecretKey(secretKeyData : PayoutTargetSecretKeyData) : Promise<boolean>
    {
        const { errors } = await this.monitorApi.mutate(gql`
            mutation (
                $payoutTargetAddress: String!,
                $secretKey: String!,
                $signature: String!
            ) { 
                setPayoutTargetSecretKey(
                    payoutTargetAddress: $payoutTargetAddress,
                    secretKey: $secretKey,
                    signature: $signature
                ) { 
                    updatedAt 
                } 
            }
        `, {
            ...secretKeyData
        });

        return !errors || !errors.length;
    }

}
