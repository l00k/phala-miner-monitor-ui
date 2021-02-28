import PayoutTargetSecretKeyData from '#/Monitor/Dto/PayoutTargetSecretKeyData';
import Account, { Fragments as AccountFragments } from '#/Monitor/Model/Account';
import Miner, { Fragments as MinerFragments } from '#/Monitor/Model/Miner';
import AppState from '#/Monitor/Model/AppState';
import Reward, { Fragments as RewardFragments } from '#/Monitor/Model/Reward';
import { Inject } from '@100k/intiv/ObjectManager';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import gql from 'graphql-tag';


export default class MonitorApi
{

    @Inject('apollo')
    protected apollo : ApolloClient<InMemoryCache>;


    public async fetchAccounts(accounts : Account[] = []) : Promise<boolean>
    {
        const ids = accounts
            .map(account => parseInt(account.id))
            .filter(id => !!id);

        if (!ids.length) {
            return true;
        }

        const idJson = JSON.stringify(ids);

        const { data: { getAccounts: rawAccounts } } = await this.apollo.query({
            query: gql`
query { 
    getAccounts(ids: ${ idJson }) { ...AccountDefaultData }
}
${AccountFragments.DefaultData}
            `
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

    public async fetchNewAccount(account : Account) : Promise<boolean>
    {
        const { data: { getAccount: rawAccount } } = await this.apollo.query({
            query: gql`
query { 
    getAccount(address: "${account.address}") { ...AccountDefaultData }
}
${AccountFragments.DefaultData}
            `
        });

        account.isUnknown = !rawAccount;

        if (!rawAccount) {
            return false;
        }

        account.setData(rawAccount);

        return true;
    }


    public async fetchMiners(miners : Miner[] = []) : Promise<boolean>
    {
        const ids = miners
            .map(miner => parseInt(miner.id))
            .filter(id => !!id);

        if (!ids.length) {
            return true;
        }

        const idJson = JSON.stringify(ids);

        const { data: { getMiners: rawMiners } } = await this.apollo.query({
            query: gql`
query { 
    getMiners(ids: ${ idJson }) { ...MinerDefaultData }
}
${MinerFragments.DefaultData}
            `
        });

        miners.forEach(miner => miner.isUnknown = true);

        if (!rawMiners || !rawMiners.length) {
            return false;
        }

        for (const rawMiner of rawMiners) {
            const miner = miners.find(_miner => _miner.id === rawMiner.id);
            if (miner) {
                miner.setData(rawMiner);
                miner.isUnknown = false;
            }
        }

        return true;
    }


    public async fetchNewMiner(miner : Miner) : Promise<boolean>
    {
        const { data: { getMinerByController: rawMiner } } = await this.apollo.query({
            query: gql`
query { 
    getMinerByController(address: "${ miner.controllerAccount.address }") { ...MinerDefaultData }
}
${MinerFragments.DefaultData}
            `
        });

        miner.isUnknown = !rawMiner;

        if (!rawMiner) {
            return false;
        }

        miner.setData(rawMiner);
        return true;
    }


    public async fetchMinerRewards(miner : Miner) : Promise<Reward[]>
    {
        const { data: { getMinerRewards: rewards } } = await this.apollo.query({
            query: gql`
query { 
    getMinerRewards(id: ${ miner.id }) { ...RewardDefaultData }
}
${RewardFragments.DefaultData}
            `
        });

        return rewards.map(rewardRaw => new Reward(rewardRaw));
    }


    public async findMinersByPayoutTarget(account : Account) : Promise<Miner[]>
    {
        const { data: { getMinersByPayoutTarget: rawMiners } } = await this.apollo.query({
            query: gql`
query { 
    getMinersByPayoutTarget(address: "${ account.address }") { ...MinerDefaultData }
}
${MinerFragments.DefaultData}
            `
        });

        if (!rawMiners || !rawMiners.length) {
            return [];
        }

        return rawMiners.map(rawMiner => new Miner(rawMiner));
    }


    public async getAppState() : Promise<AppState>
    {
        const { data: { getAppState: { data } } } = await this.apollo.query({
            query: gql`query { getAppState { data } }`
        });

        return new AppState(JSON.parse(data));
    }

    public async mutatePayoutTargetSecretKey(secretKeyData : PayoutTargetSecretKeyData) : Promise<boolean>
    {
        const { errors } = await this.apollo.mutate({
            mutation: gql`
mutation { 
    setPayoutTargetSecretKey(
        payoutTargetAddress: "${secretKeyData.payoutTargetAddress}",
        secretKey: "${secretKeyData.secretKey}",
        signature: "${secretKeyData.signature}"
    ) { 
        updatedAt 
    } 
}
            `
        });

        return !errors || !errors.length;
    }

}
