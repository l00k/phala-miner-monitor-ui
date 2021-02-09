import { Singleton, Inject } from '@100k/intiv/ObjectManager';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import gql from 'graphql-tag'
import Account from '#/Monitor/Model/Account'

@Singleton()
export default class MonitorApi
{

    @Inject('apollo')
    protected apollo : ApolloClient<InMemoryCache>;

    public async fetchAccounts(accounts : Account[] = []) : Promise<void>
    {
        const addresses = accounts
            .map(account => account.address)
            .filter(address => !!address);

        if (!addresses.length) {
            return;
        }

        const addressesJson = JSON.stringify(addresses);

        const { data: { getAccounts: rawAccounts } } = await this.apollo.query({
            query: gql`query {
getAccounts(addresses: ${addressesJson}) {
    address,
    balance,
    fire,
    fireMined,
    lastUpdate,
    isPayoutTarget,
    isMiner,
    extrinsics {
        date,
        action,
        isSuccessful
    },
    minedRewards {
        date,
        fire
    },
    receivedRewards {
        date,
        fire
    }
}
            }`
        });

        for (const rawAcocunt of rawAccounts) {
            const account = accounts.find(_account => _account.address === rawAcocunt.address);
            if (account) {
                account.setData(rawAcocunt);
            }
        }
    }

    public async findMinersByPayoutTarget(account : Account) : Promise<string[]>
    {
        const { data: { getMinersByPayoutTarget: rawAccounts } } = await this.apollo.query({
            query: gql`query { getMinersByPayoutTarget(payoutTarget: "${account.address}") { address } }`
        });

        return rawAccounts.map(rawAccount => rawAccount.address);
    }

}
