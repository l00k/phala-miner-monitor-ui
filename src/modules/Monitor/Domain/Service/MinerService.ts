import Account from '#/Monitor/Domain/Model/Account';
import DateTimeInterval from '#/Monitor/Domain/Model/DateTimeInterval';
import Miner, { Fragments as MinerFragments } from '#/Monitor/Domain/Model/Miner';
import MonitorApi from '#/Monitor/Service/MonitorApi';
import { Inject } from '@100k/intiv/ObjectManager';
import gql from 'graphql-tag';


type RewardChunkParams = {
    minerId : number,
    groupBy? : DateTimeInterval,
};

export default class MinerService
{

    @Inject()
    protected monitorApi : MonitorApi;


    public async fetch(miners : Miner[] = []) : Promise<boolean>
    {
        const ids = miners
            .map(miner => miner.id)
            .filter(id => !!id);

        if (!ids.length) {
            return true;
        }

        const idJson = JSON.stringify(ids);

        const { rawMiners } = await this.monitorApi.query(gql`
            query (
                $ids : [Int!]!
            ) { 
                rawMiners: getMiners(
                    ids: $ids
                ) { 
                    ...MinerDefaultData
                }
            }
            ${ MinerFragments.DefaultData }
        `, {
            ids
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

    public async fetchNew(miner : Miner) : Promise<boolean>
    {
        const { rawMiner } = await this.monitorApi.query(gql`
            query (
                $address : String!
            ) { 
                rawMiner: getMinerByController(
                    address: $address
                ) { 
                    ...MinerDefaultData
                }
            }
            ${ MinerFragments.DefaultData }
        `, {
            address: miner.controllerAccount.address
        });

        miner.isUnknown = !rawMiner;

        if (!rawMiner) {
            return false;
        }

        miner.setData(rawMiner);
        return true;
    }

    public async findByPayoutTarget(account : Account) : Promise<Miner[]>
    {
        const { rawMiners } = await this.monitorApi.query(gql`
            query (
                $address : String!
            ) { 
                rawMiners: getMinersByPayoutTarget(
                    address: $address
                ) { 
                    ...MinerDefaultData
                }
            }
            ${ MinerFragments.DefaultData }
        `, {
            address: account.address
        });

        if (!rawMiners || !rawMiners.length) {
            return [];
        }

        return rawMiners.map(rawMiner => new Miner(rawMiner));
    }

}
