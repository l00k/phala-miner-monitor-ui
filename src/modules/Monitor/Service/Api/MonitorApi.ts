import Account from '#/Monitor/Model/Account';
import Miner, { Fragments } from '#/Monitor/Model/Miner';
import { Singleton, Inject } from '@100k/intiv/ObjectManager';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import gql from 'graphql-tag';


@Singleton()
export default class MonitorApi
{

    @Inject('apollo')
    protected apollo : ApolloClient<InMemoryCache>;


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
${Fragments.MinerDefaultData}
            `
        });

        if (!rawMiners || !rawMiners.length) {
            return false;
        }

        for (const rawMiner of rawMiners) {
            const miner = miners.find(_miner => _miner.id === rawMiner.id);
            if (miner) {
                miner.setData(rawMiner);
            }
        }

        console.dir(rawMiners)
        console.dir(miners)

        return true;
    }


    public async fetchMinerByController(miner : Miner) : Promise<boolean>
    {
        const { data: { getMinerByController: rawMiner } } = await this.apollo.query({
            query: gql`
query { 
    getMinerByController(address: "${ miner.controllerAccount.address }") { ...MinerDefaultData }
}
${Fragments.MinerDefaultData}
            `
        });

        if (!rawMiner) {
            return false;
        }

        miner.setData(rawMiner);
        return true;
    }


    public async findMinersByPayoutTarget(account : Account) : Promise<Miner[]>
    {
        const { data: { getMinersByPayoutTarget: rawMiners } } = await this.apollo.query({
            query: gql`
query { 
    getMinersByPayoutTarget(address: "${ account.address }") { ...MinerDefaultData }
}
${Fragments.MinerDefaultData}
            `
        });

        if (!rawMiners || rawMiners.length) {
            return [];
        }

        return rawMiners.map(rawMiner => new Miner(rawMiner));
    }

}
