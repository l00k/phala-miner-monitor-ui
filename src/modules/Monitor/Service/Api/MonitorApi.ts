import { Singleton, Inject } from '@100k/intiv/ObjectManager';
import gql from 'graphql-tag'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
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

    public async fetchSingleAccount(accounts : string[] = []) : Promise<void>
    {
        const rawData = await this.apollo.query({
            query: gql`query getAccounts(addresses: ["4281YSs23igo3TVMDFezHMgrAN4pzRBKDi6sN6Zr9MjpNA4j"]) Account`
        });

        console.log(rawData)
    }

}
